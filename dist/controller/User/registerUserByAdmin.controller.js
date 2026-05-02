"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserByAdmin = void 0;
const auth_1 = require("../../types/auth");
const auth_service_1 = require("../../services/auth.service");
const user_model_1 = __importDefault(require("../../models/user.model"));
const registerUserByAdmin = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const validRoles = Object.values(auth_1.Roles);
        if (!validRoles.includes(role)) {
            res.status(400).json({ message: "Rol inválido" });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)(password);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            role,
            mustChangePassword: true
        });
        await newUser.save();
        res.status(201).json({ user: newUser });
    }
    catch (error) {
        res.status(500).json({ message: "Error creando usuario", error });
    }
};
exports.registerUserByAdmin = registerUserByAdmin;
