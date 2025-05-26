"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_service_1 = require("../../services/auth.service");
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Buscar usuario por correo
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Usuario no encontrado" });
            return;
        }
        // Comparar la contraseña
        const isMatch = await (0, auth_service_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Contraseña incorrecta" });
            return;
        }
        // Generación del token
        const token = (0, auth_service_1.generateToken)(user);
        // Excluir la contraseña del objeto de usuario
        const { password: userPassword, _id, ...userWithoutPassword } = user.toObject();
        const userWithId = { ...userWithoutPassword, id: _id };
        // Devolver el token y los datos del usuario (incluido el rol)
        res.json({ token, user: userWithId });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
};
exports.login = login;
