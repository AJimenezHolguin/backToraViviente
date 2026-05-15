import { Response } from "express";

import User from "../../models/user.model";
import { hashPassword } from "../../services/auth.service";
import { AuthRequest } from "../../middleware/types";

export const changePassword = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    if (!newPassword) {
      res.status(400).json({ message: "La nueva contraseña es requerida" });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.mustChangePassword = false; 

    await user.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar contraseña", error });
  }
};