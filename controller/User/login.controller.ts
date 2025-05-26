import { RequestHandler } from "express";
import userModel from "../../models/user.model";
import { comparePasswords, generateToken } from "../../services/auth.service";


export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por correo
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Usuario no encontrado" });
      return;
    }

    // Comparar la contraseña
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Contraseña incorrecta" });
      return;
    }

    // Generación del token
    const token = generateToken(user);

    // Excluir la contraseña del objeto de usuario
    const { password: userPassword, _id, ...userWithoutPassword } = user.toObject();
    const userWithId = { ...userWithoutPassword, id: _id };

    // Devolver el token y los datos del usuario (incluido el rol)
    res.json({ token, user: userWithId });
  } catch (error) {
    res.status(500).json({ message: "Error en el login", error });
  }
};
