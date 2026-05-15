import { Response } from "express";
import User from "../../models/user.model";
import { AuthRequest } from "../../middleware/types";

export const reactivateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        message: "El id del usuario es requerido",
      });
      return;
    }

    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({
        message: "Usuario no encontrado",
      });
      return;
    }

    if (user.isActive) {
      res.status(400).json({
        message: "El usuario ya está activo",
      });
      return;
    }

    user.isActive = true;
    await user.save();

    res.json({
      message: "Usuario reactivado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al reactivar usuario",
      error,
    });
  }
};
