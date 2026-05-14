"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordChange = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const validatePasswordChange = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Usuario no autenticado" });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
            return;
        }
        if (user.mustChangePassword) {
            res.status(403).json({
                message: "Debe cambiar su contraseña antes de continuar",
                mustChangePassword: true,
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: "Error validando estado de contraseña" });
    }
};
exports.validatePasswordChange = validatePasswordChange;
