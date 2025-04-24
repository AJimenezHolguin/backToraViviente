"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const auth_service_1 = require("../../services/auth.service");
const auth_1 = require("../../types/auth");
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const validRoles = Object.values(auth_1.Roles);
        if (role && !validRoles.includes(role)) {
            res.status(400).json({ message: "Rol inválido" });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)(password);
        // Asignación del rol (predeterminado a 'user')
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Si no se pasa rol, el predeterminado es 'user'
        });
        await newUser.save();
        // Generate token for the new user
        const token = (0, auth_service_1.generateToken)(newUser);
        res.status(201).json({
            user: newUser,
            token,
        });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error en el registro", error });
    }
};
exports.register = register;
