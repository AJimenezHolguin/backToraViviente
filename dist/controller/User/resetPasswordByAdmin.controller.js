"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordByAdmin = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_service_1 = require("../../services/auth.service");
const auth_1 = require("../../types/auth");
const resetPasswordByAdmin = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            res.status(400).json({
                message: "Email y nueva contraseña son requeridos"
            });
            return;
        }
        if (req.user?.role !== auth_1.Roles.Admin) {
            res.status(403).json({
                message: "No tienes permisos para realizar esta acción"
            });
            return;
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado"
            });
            return;
        }
        if (String(req.user._id) === String(user._id)) {
            res.status(400).json({
                message: "No puedes resetear tu propia contraseña"
            });
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)(newPassword);
        user.password = hashedPassword;
        user.mustChangePassword = true;
        await user.save();
        res.json({
            message: "Contraseña reasignada correctamente"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al resetear contraseña",
            error
        });
    }
};
exports.resetPasswordByAdmin = resetPasswordByAdmin;
