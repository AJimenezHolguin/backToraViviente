"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reactivateUser = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                message: "El id del usuario es requerido",
            });
            return;
        }
        const user = await user_model_1.default.findById(id);
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado",
            });
            return;
        }
        if (user.isActive) {
            res.status(400).json({
                message: "El usuario ya está activo",
            });
            return;
        }
        user.isActive = true;
        await user.save();
        res.json({
            message: "Usuario reactivado correctamente",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al reactivar usuario",
            error,
        });
    }
};
exports.reactivateUser = reactivateUser;
