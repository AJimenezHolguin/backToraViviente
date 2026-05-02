import { Response } from "express";
import User from "../../models/user.model";
import { AuthRequest } from "../../middleware/types";

export const deactivateUser = async (
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

    if (String(req.user?._id) === String(user._id)) {
      res.status(400).json({
        message: "No puedes desactivar tu propio usuario",
      });
      return;
    }

    if (!user.isActive) {
      res.status(400).json({
        message: "El usuario ya está inactivo",
      });
      return;
    }

    user.isActive = false;
    await user.save();

    res.json({
      message: "Usuario desactivado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al desactivar usuario",
      error,
    });
  }
};
