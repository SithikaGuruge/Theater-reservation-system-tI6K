import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token
    req.user = decoded.UserInfo.id;
    req.role = decoded.UserInfo.role;
    next();
  });
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "Not Authenticated"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid Token"));
    }
    req.user = user;
    next();
  });
};

export const verifyUser = async (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json("You are not allowed to do this");
    }
  });
};

export const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == "admin") {
      next();
    } else {
      return res.status(403).json("You do not have admin access");
    }
  });
};

export const verifyTheatreAdmin = async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "theatre_admin") {
      next();
    } else {
      return res.status(403).json("You do not have admin access");
    }
  });
};
