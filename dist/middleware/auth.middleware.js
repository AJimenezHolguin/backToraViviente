"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No autorizado - Token faltante" });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = {
            _id: verified.id,
            role: verified.role,
            name: verified.name,
            email: verified.email,
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};
exports.default = authMiddleware;
