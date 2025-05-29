"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRole = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.user = { _id: verified.id, role: verified.role }; // Incluye el ID y el rol del usuario en la solicitud
        next();
    }
    catch (error) {
        res.status(400).json({ message: "Token inválido" });
    }
};
/**
 * Middleware para validar roles específicos
 * @param allowedRoles Roles permitidos para acceder a la ruta
 */
const validateRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res
                .status(401)
                .json({ message: "No autorizado - Usuario no autenticado" });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: "Acceso denegado - Rol no permitido" });
            return;
        }
        next();
    };
};
exports.validateRole = validateRole;
exports.default = authMiddleware;
