"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_service_1 = require("../../services/auth.service");
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({
            email,
            isActive: true
        });
        if (!user) {
            res.status(400).json({ message: "Usuario no encontrado o inactivo" });
            return;
        }
        const isMatch = await (0, auth_service_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Contraseña incorrecta" });
            return;
        }
        const token = (0, auth_service_1.generateToken)(user);
        const { password: userPassword, _id, ...userWithoutPassword } = user.toObject();
        const userWithId = { ...userWithoutPassword, id: _id };
        res.json({ token, user: userWithId });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
};
exports.login = login;
