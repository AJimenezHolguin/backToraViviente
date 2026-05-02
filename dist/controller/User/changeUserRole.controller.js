"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserRole = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_1 = require("../../types/auth");
const changeUserRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        if (!userId || !newRole) {
            res.status(400).json({
                message: "userId y newRole son requeridos",
            });
            return;
        }
        const validRoles = Object.values(auth_1.Roles);
        if (!validRoles.includes(newRole)) {
            res.status(400).json({
                message: "Rol inválido",
            });
            return;
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({
                message: "Usuario no encontrado",
            });
            return;
        }
        if (String(req.user?._id) === String(user._id)) {
            res.status(400).json({
                message: "No puedes cambiar tu propio rol",
            });
            return;
        }
        user.role = newRole;
        await user.save();
        res.json({
            message: "Rol actualizado correctamente",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error al cambiar rol",
            error,
        });
    }
};
exports.changeUserRole = changeUserRole;
