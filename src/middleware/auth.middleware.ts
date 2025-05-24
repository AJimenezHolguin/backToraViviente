import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Roles } from "../types/auth"; // Ajusta la ruta según tu estructura

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: Roles;
  };
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const verified = jwt.verify(token, SECRET_KEY) as {
      id: string;
      role: Roles;
    };
    req.user = { _id: verified.id, role: verified.role }; // Incluye el ID y el rol del usuario en la solicitud
    next();
  } catch (error) {
    res.status(400).json({ message: "Token inválido" });
  }
};

/**
 * Middleware para validar roles específicos
 * @param allowedRoles Roles permitidos para acceder a la ruta
 */
export const validateRole = (allowedRoles: Roles[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res
        .status(401)
        .json({ message: "No autorizado - Usuario no autenticado" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Acceso denegado - Rol no permitido" });
      return;
    }

    next();
  };
};

export default authMiddleware;
