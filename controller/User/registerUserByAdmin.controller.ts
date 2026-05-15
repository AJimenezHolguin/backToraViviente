import { RequestHandler } from "express";
import { Roles } from "../../types/auth";
import { hashPassword } from "../../services/auth.service";
import User from "../../models/user.model";

export const registerUserByAdmin: RequestHandler = async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      const validRoles = Object.values(Roles);
      if (!validRoles.includes(role)) {
        res.status(400).json({ message: "Rol inválido" });
        return;
      }
  
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
        role,
        mustChangePassword: true 
      });
  
      await newUser.save();
  
      res.status(201).json({ user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creando usuario", error });
    }
  };