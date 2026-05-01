import { Request, Response, NextFunction } from "express";
import { Roles } from "../types/auth";

export const validateRole = (allowedRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userRole = req.user?.role;
      if (!userRole) {
        res.status(401).json({ message: "No autorizado - Rol no encontrado" });
        return;
      }

      if (!allowedRoles.includes(userRole)) {
        res.status(403).json({ message: "Acceso denegado - Rol no permitido" });
        return;
      }

      next();
    } catch (error) {
      console.error("Error en la validación de rol:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
};
