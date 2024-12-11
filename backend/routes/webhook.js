import express from "express";
import Stripe from "stripe";
import "dotenv/config";
import { createPurchaseFromSession } from "../controllers/purchase.js";
import { generateQRCode } from "../routes/payment-recipt/qrcodegen.js";
import { createPDF } from "./payment-recipt/create_pdf.js";
import { tokenGen } from "./tokenGen.js";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Error verifying Stripe webhook signature:", err);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const pi = session.payment_intent;
      const theatreId = session.metadata?.theatreId;
      const showId = session.metadata?.showId || 1;
      const seatInfo = session.metadata?.selectedSeats;
      const price = session.metadata?.total_price;
      const discount = session.metadata?.discount;
      const customerEmail = session.customer_details.email;

      const token = tokenGen();

      if (!theatreId || !showId) {
        console.error("Missing metadata in session");
        return res.sendStatus(400);
      }
      let lineItems;

      try {
        const retrievedSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items"],
          }
        );
        lineItems = retrievedSession.line_items.data;
      } catch (err) {
        console.error("Error fetching line items:", err);
        return res.sendStatus(500);
      }

      const seats = JSON.parse(seatInfo)
        .map((seat) => seat.seat_label)
        .join(",");

      const reqForCreatePurchase = {
        body: {
          theatre_id: theatreId,
          show_time_id: showId,
          seats: seats,
          pi: pi,
          token: token,
          price: price,
          discount: discount,
        },
      };
      console.log("webhook", reqForCreatePurchase);

      try {
        await createPurchaseFromSession(reqForCreatePurchase);

        const qrCodeDataUrl = await generateQRCode(
          JSON.stringify(reqForCreatePurchase.body)
        );

        const pdfBytes = await createPDF(
          reqForCreatePurchase.body,
          qrCodeDataUrl
        );

        await sendEmailWithAttachment(
          customerEmail,
          pdfBytes,
          `https://theater-reservation-system-ebon.vercel.app/refund/${token}`
        );
      } catch (error) {
        console.error(error);
        return res.sendStatus(500);
      }
    }

    res.status(200).json({ received: true });
  }
);

const sendEmailWithAttachment = async (toEmail, pdfBytes, refundLink) => {
  try {
    const info = await transporter.sendMail({
      from: `"Movie Mingle" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Your Ticket",
      html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Purchase</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000000; /* Black background for the whole email */
      color: #ffffff;
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #09081d; /* Dark blue background for the email card */
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }
    h1 {
      text-align: center;
      color: #ffffff; /* White text for heading */
      margin-bottom: 20px;
    }
    p {
      margin: 15px 0;
      color: #ffffff; /* White text for paragraphs */
    }
    a {
      color: #ffffff;
      text-decoration: none;
      background-color: #102db0; /* Accent color for the button */
      padding: 12px 20px;
      border-radius: 5px;
      display: inline-block;
      margin-top: 20px;
      text-align: center;
    }
    a:hover {
      background-color: #081138; /* Lighter shade on hover */
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 14px;
      color: #888; /* Gray for footer text */
    }
  </style>
</head>
<body>
  <div class="email-container">
    <h1>Thank You for Your Purchase!</h1>
    <p>We are thrilled you have chosen us for your movie experience!</p>
    <p>Your ticket is attached in PDF format.</p>
    <p>If you need to request a refund or cancel your purchase, please click the link below:</p>
    <p style="text-align: center;">
      <a href="${refundLink}">Refund or Cancel Purchase</a>
    </p>
    <div class="footer">
      <p>For more information, visit our website or contact customer support.</p>
    </div>
  </div>
</body>
</html>

      `,
      attachments: [
        {
          filename: "ticket.pdf",
          content: pdfBytes,
          encoding: "base64", // PDF content encoding
        },
      ],
    });

    console.log("Email sent:");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to handle it outside this function
  }
};

export default router;
