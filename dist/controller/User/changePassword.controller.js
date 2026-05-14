"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_service_1 = require("../../services/auth.service");
const changePassword = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { newPassword } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        if (!newPassword) {
            res.status(400).json({ message: "La nueva contraseña es requerida" });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)(newPassword);
        user.password = hashedPassword;
        user.mustChangePassword = false;
        await user.save();
        res.json({ message: "Contraseña actualizada correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al cambiar contraseña", error });
    }
};
exports.changePassword = changePassword;
