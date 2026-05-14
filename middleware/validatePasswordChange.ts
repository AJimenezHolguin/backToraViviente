import { Response, NextFunction } from "express";
import User from "../models/user.model";
import { AuthRequest } from "./types";

export const validatePasswordChange = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (user.mustChangePassword) {
      res.status(403).json({
        message: "Debe cambiar su contraseña antes de continuar",
        mustChangePassword: true,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error validando estado de contraseña" });
  }
};
