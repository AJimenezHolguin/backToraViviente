import { NextFunction, RequestHandler, Request, Response } from "express";
import mongoose from "mongoose";
import Song from "../../models/song.model";
/**
 * @desc    Crear una nueva canción
 * @route   POST /api/songs
 * @access  Privado (requiere autenticación)
 */
export const createSong: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, fileSong, fileScore, linkSong, category } = req.body;
    const userId = req.user?._id; // Assuming the auth middleware adds the user

    // Validaciones básicas
    if (!name) {
      res.status(400).json({ message: "El nombre de la canción es requerido" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "No autorizado - Usuario no identificado" });
      return;
    }

    // Crear la nueva canción
    const newSong = new Song({
      name,
      fileSong: fileSong || undefined,
      fileScore: fileScore || undefined,
      linkSong: linkSong || undefined,
      category: category || undefined,
      user: userId
    });

    // Guardar en la base de datos
    const savedSong = await newSong.save();

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      data: savedSong,
      message: "Canción creada exitosamente"
    });
    return;
  } catch (error: any) {
    // Manejo de errores de validación de Mongoose
    if (error instanceof mongoose.Error.ValidationError) {
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

/**
 * @desc    Obtener todas las canciones
 * @route   GET /api/songs
 * @access  Público
 */
export const getSongs: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const songs = await Song.find().populate("user", "name email"); // Ajusta los campos según tu modelo User
    
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las canciones",
      error: error.message
    });
  }
};

/**
 * @desc    Obtener una canción por ID
 * @route   GET /api/songs/:id
 * @access  Público
 */
export const getSongById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const song = await Song.findById(req.params.id).populate("user", "name email");
    
    if (!song) {
      res.status(404).json({
        success: false,
        message: "Canción no encontrada"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: song
    });
    return;
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "ID de canción inválido"
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: "Error al obtener la canción",
      error: error.message
    });
  }
};