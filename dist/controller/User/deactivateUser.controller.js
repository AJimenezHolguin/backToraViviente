"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const deactivateUser = async (req, res) => {
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
        if (String(req.user?._id) === String(user._id)) {
            res.status(400).json({
                message: "No puedes desactivar tu propio usuario",
            });
            return;
        }
        if (!user.isActive) {
            res.status(400).json({
                message: "El usuario ya está inactivo",
            });
            return;
        }
        user.isActive = false;
        await user.save();
        res.json({
            message: "Usuario desactivado correctamente",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al desactivar usuario",
            error,
        });
    }
};
exports.deactivateUser = deactivateUser;
