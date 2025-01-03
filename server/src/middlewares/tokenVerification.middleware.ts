import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";

config();

const JWT_SECRET = process.env.JWTSECRET; // Replace with environment variable

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid",status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to the next middleware/route
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
