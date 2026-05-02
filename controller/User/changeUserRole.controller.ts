import { Response } from "express";
import User from "../../models/user.model";
import { Roles } from "../../types/auth";
import { AuthRequest } from "../../middleware/types";

export const changeUserRole = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      res.status(400).json({
        message: "userId y newRole son requeridos",
      });
      return;
    }

    const validRoles = Object.values(Roles);
    if (!validRoles.includes(newRole)) {
      res.status(400).json({
        message: "Rol inválido",
      });
      return;
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        message: "Usuario no encontrado",
      });
      return;
    }

    if (String(req.user?._id) === String(user._id)) {
      res.status(400).json({
        message: "No puedes cambiar tu propio rol",
      });
      return;
    }

    user.role = newRole;
    await user.save();

    res.json({
      message: "Rol actualizado correctamente",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar rol",
      error,
    });
  }
};
