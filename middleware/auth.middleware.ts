import { Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Roles } from "../types/auth"; 
import { AuthRequest } from "./types";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET as string;

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No autorizado - Token faltante" });
    return;
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY) as {
      id: string;
      name: string;
      email: string;
      role: Roles;
    };
    req.user = {
      _id: verified.id,
      role: verified.role,
      name: verified.name,
      email: verified.email,
    }; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido o expirado" });
  }
};

export default authMiddleware;
