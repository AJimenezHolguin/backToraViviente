import { NextFunction, RequestHandler, Request, Response } from "express";
import User from "../../models/user.model";
import { hashPassword, generateToken } from "../../services/auth.service";
import { Roles } from "../../types/auth";

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const validRoles = Object.values(Roles);
    if (role && !validRoles.includes(role)) {
      res.status(400).json({ message: "Rol inválido" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    // Asignación del rol (predeterminado a 'user')
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",  // Si no se pasa rol, el predeterminado es 'user'
    });
    await newUser.save();

    // Generate token for the new user
    const token = generateToken(newUser);

    res.status(201).json({
      user: newUser,
      token,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Error en el registro", error });
  }
};
