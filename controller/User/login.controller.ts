import { RequestHandler } from "express";
import userModel from "../../models/user.model";
import { comparePasswords, generateToken } from "../../services/auth.service";

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({
       email,
       isActive: true 
      });
    if (!user) {
      res.status(400).json({ message: "Credenciales inválidas" });
      return;
    }

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    const token = generateToken(user);

    const {
      password: userPassword,
      _id,
      ...userWithoutPassword
    } = user.toObject();
    const userWithId = { ...userWithoutPassword, id: _id };

    res.json({ token, user: userWithId });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};
