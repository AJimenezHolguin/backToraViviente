"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSong = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const createSong = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "No autorizado - Usuario no identificado" });
            return;
        }
        const { name, category, linkSong, fileScore, fileSong } = req.body;
        console.log(req.body);
        // Crear nueva canción
        const newSong = new songs_model_1.default({
            name,
            category,
            linkSong,
            ...(fileScore && {
                fileScore: {
                    public_id: fileScore.public_id,
                    secure_url: fileScore.secure_url
                }
            }),
            ...(fileSong && {
                fileSong: {
                    public_id: fileSong.public_id,
                    secure_url: fileSong.secure_url
                }
            }),
            user: userId,
        });
        // Guardar canción
        await newSong.save();
        // Respuesta
        res.status(201).json({
            success: true,
            message: "Canción creada exitosamente",
            song: newSong,
        });
    }
    catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => el.message);
            res.status(400).json({
                success: false,
                message: "Error de validación",
                errors
            });
            return;
        }
        // Otros errores
        res.status(500).json({
            success: false,
            message: "Error al crear la canción",
            error: error.message
        });
    }
};
exports.createSong = createSong;
