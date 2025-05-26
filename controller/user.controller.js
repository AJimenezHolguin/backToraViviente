"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_service_1 = require("../services/auth.service");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "El usuario ya existe" });
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)(password);
        const newUser = new user_model_1.default({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Usuario registrado exitosamente" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error en el registro", error });
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Usuario no encontrado" });
            return;
        }
        const isMatch = await (0, auth_service_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Contraseña incorrecta" });
            return;
        }
        const token = (0, auth_service_1.generateToken)(user);
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Error en el login", error });
    }
};
exports.login = login;
const getUsers = async (req, res) => {
    const users = await user_model_1.default.find();
    res.json(users);
};
exports.getUsers = getUsers;
const deleteUser = async (req, res) => {
    await user_model_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
};
exports.deleteUser = deleteUser;
