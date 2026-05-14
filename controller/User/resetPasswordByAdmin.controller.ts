import { Response } from "express";
import User from "../../models/user.model";
import { hashPassword } from "../../services/auth.service";
import { Roles } from "../../types/auth";
import { AuthRequest } from "../../middleware/types";

export const resetPasswordByAdmin = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({
        message: "Email y nueva contraseña son requeridos"
      });
      return;
    }

    if (req.user?.role !== Roles.Admin) {
      res.status(403).json({
        message: "No tienes permisos para realizar esta acción"
      });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "Usuario no encontrado"
      });
      return;
    }

    if(String(req.user._id) === String(user._id)) {
      res.status(400).json({
        message: "No puedes resetear tu propia contraseña"
      });
      return;
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.mustChangePassword = true;

    await user.save();

    res.json({
      message: "Contraseña reasignada correctamente"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al resetear contraseña",
      error
    });
  }
};