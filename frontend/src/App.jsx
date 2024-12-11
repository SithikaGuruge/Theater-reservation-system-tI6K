import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import UnauthorizedPage from "./components/Errors/Unauthorized";
import Home from "./pages/Home";
import Movies from "./pages/MoviePage";
import Theatres from "./pages/TheatrePage";
import Schedule from "./pages/SchedulePage";
import Help from "./pages/HelpPage";
import Terms from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Footer from "./components/Footer/Footer";
import React from "react";

import SeatSelection from "./components/Seat Selection/SeatSelection";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import Forgotpassword from "./components/User Login/Forgotpassword";
import OTPInput from "./components/User Login/OTPInput";
import Reset from "./components/User Login/Reset";

import PaymentFailure from "./pages/PaymentFailure";
import PaymentSuccess from "./pages/PaymentSuccess";

import TheatreDetails from "./pages/TheatreDetailsPage";
import MovieDetails from "./pages/MovieDetailsPage";

import Layout from "./layout/layout";
import RequireAuth from "./components/Errors/RequireAuth";
import PersistLogin from "./components/Persist Login/PersistLogin";

import UserProfile from "./pages/UserProfile";

// seat grid user side
import SeatGridUser from "./components/Seat Selection/SeatGridUser";

// Admin Panel
import CreateCoupon from "./components/Admin/Discounts/CreateCoupon";
import SeatGrid from "./components/Admin/SeatGrid/SeatGrid";
import AddTheatreForm from "./components/Admin/Theatre/AddTheatreAdmin";
import UpdateTheatreAdmin from "./components/Admin/Theatre/UpdateTheatreAdmin";
import ManageTheatres from "./pages/Admin/Admin-Theatre";
import AddNewMovie from "./components/Admin/Movies/AddNewMovie";
import UpdateMovie from "./components/Admin/Movies/UpdateMovie";
import AdminMovie from "./pages/Admin/Admin-Movie";
import Dashboard from "./components/Admin/Dashboard/Dashboard";
import AdminRefundPage from "./components/Admin/Refund/RefundReq";
import HandleChildrenPrices from "./components/Admin/Theatre/HandleChildrenPrices";
// chatbot
import Chatbot from "../src/components/Chatbot/ChatBot";

// Theatre Admin

import TheatreAdminDashboard from "./components/Theatre Admin/Home/Dashboard";
import ManageTheatre from "./components/Theatre Admin/Manage Theatre/ManageTheatre";
import QRCodeScanner from "./components/Theatre Admin/QR Code Scanner/QRCodeScanner";
import ShowTimes from "./components/Theatre Admin/ShowTimes Management/ShowTimes";
import Reviews from "./components/Theatre Admin/ReviewsManagement/Reviews";

import RequestRefund from "./pages/RequestRefund";
import AdminUser from "./pages/Admin/Admin-User";
import UserDetails from "./components/Admin/Users/UserDetails";


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/unauthorized" element={<UnauthorizedPage />}></Route>
            <Route path="/schedule" element={<Schedule />} />
            <Route
              path="/seatgrid/:showId/:theatreId"
              element={<SeatGridUser />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="/otp" element={<OTPInput />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/theatre/:id" element={<TheatreDetails />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            <Route path="/schedule/:paramId" element={<Schedule />} />
            <Route path="/reset" element={<Reset />}></Route>
            <Route
              path="/seat-selection/:showId/:theatreId"
              element={<SeatSelection />}
            />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<PersistLogin />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/theatres" element={<Theatres />} />
              <Route path="/refund/:token" element={<RequestRefund />}></Route>

              <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                <Route
                  path="/admin/refunds"
                  element={<AdminRefundPage />}
                ></Route>
                <Route
                  path="/admin/discounts"
                  element={<CreateCoupon />}
                ></Route>
                <Route
                  path="/admin/update-theatre/:id"
                  element={<UpdateTheatreAdmin />}
                ></Route>

                <Route
                  path="/admin/seatgrid/:theatreId"
                  element={<SeatGrid />}
                ></Route>
                <Route
                  path="/admin/specialprices/:theatreId"
                  element={<HandleChildrenPrices />}
                ></Route>

                <Route
                  path="/admin/add-theatre"
                  element={<AddTheatreForm />}
                ></Route>
                <Route
                  path="/admin/manage-theatres"
                  element={<ManageTheatres />}
                ></Route>

                <Route path="/admin/users" element={<AdminUser/>}></Route>
                <Route path="/admin/users/:id" element={<UserDetails/>}/>

                <Route path="/admin/add-new-movie" element={<AddNewMovie />} />
                <Route
                  path="/admin/update-movie/:id"
                  element={<UpdateMovie />}
                />
                <Route path="/admin/movie" element={<AdminMovie />} />
                <Route path="/admin" element={<Dashboard />} />
              </Route>

              <Route element={<RequireAuth allowedRoles={["theatreAdmin"]} />}>
                <Route
                  path="/theatre-admin"
                  element={<TheatreAdminDashboard />}
                />
                <Route
                  path="/theatre-admin/showtimes"
                  element={<ShowTimes />}
                />
                <Route
                  path="/theatre-admin/manage-theatre"
                  element={<ManageTheatre />}
                />
                <Route
                  path="/theatre-admin/qr-code-scanner"
                  element={<QRCodeScanner />}
                />

                <Route
                  path="/theatre-admin/view-reviews"
                  element={<Reviews />}
                />

              </Route>

              <Route element={<RequireAuth allowedRoles={["systemManager"]} />}>
                <Route
                  path="/system-manager"
                  element={<TheatreAdminDashboard />}
                />
              </Route>
            </Route>

            <Route
              path="/payment-failure/:showId/:theatreId"
              element={<PaymentFailure />}
            />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
        <Chatbot chatbotId={"nfGTj217gv4zsYzJ5dct2"} />
        <ConditionalLayout />
      </Router>
    </div>
  );
};

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isTheatreAdminPage = location.pathname.startsWith("/theatre-admin");

  return (
    <>
      {!isAdminPage && !isTheatreAdminPage && <Footer />}
      {children}
    </>
  );
};

export default App;
