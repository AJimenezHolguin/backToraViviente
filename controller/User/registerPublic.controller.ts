import { NextFunction, RequestHandler, Request, Response } from "express";
import User from "../../models/user.model";
import { hashPassword, generateToken } from "../../services/auth.service";
import { Roles } from "../../types/auth";

export const registerPublic: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "El usuario ya existe" });
      return;
    }

    const hashedPassword = await hashPassword(password);

   
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: Roles.User,
      mustChangePassword: false,  
    });
    await newUser.save();

    
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
