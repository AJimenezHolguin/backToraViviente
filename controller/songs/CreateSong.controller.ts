import { NextFunction, RequestHandler, Request, Response } from "express";

// Extend the Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        role: any; _id: string
      }; // Adjust the type of user as per your application
    }
  }
}
import mongoose from "mongoose";
import songsModel from "../../models/songs.model";
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
    // Assuming the auth middleware adds the user
    const userId = req.user?._id;


    if (!name) {
      res.status(400).json({ message: "El nombre de la canción es requerido" });
      return;
    }

    if (!userId) {
      res.status(401).json({ message: "No autorizado - Usuario no identificado" });
      return;
    }

    // Crear la nueva canción
    const newSong = new songsModel({
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
    const songs = await songsModel.find().populate("user", "name email"); // Ajusta los campos según tu modelo User

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
    const song = await songsModel.findById(req.params.id).populate("user", "name email");
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

/**
 * @desc    Obtener todas las canciones creadas por un usuario específico
 * @route   GET /api/songs/user/:userId
 * @access  Privado (requiere autenticación)
 */
export const getSongsByUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?._id;
    // Validar que el userId esté presente
    if (!userId) {
      res.status(400).json({ message: "El ID del usuario es requerido" });
      return;
    }

    // Buscar canciones creadas por el usuario
    const songs = await songsModel.find({ user: userId }).populate("user", "name email");

    // Verificar si el usuario tiene canciones
    if (songs.length === 0) {
      res.status(404).json({
        success: false,
        message: "No se encontraron canciones para este usuario",
      });
      return;
    }

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las canciones del usuario",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar todas las canciones creadas por un usuario específico
 * @route   DELETE /api/songs/mysongs
 * @access  Privado (requiere autenticación)
 */
export const deleteMySongs: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el ID del usuario autenticado desde req.user
    const userId = req.user?._id;

    // Validar que el usuario esté autenticado
    if (!userId) {
      res.status(401).json({ message: "No autorizado - Usuario no autenticado" });
      return;
    }

    // Eliminar todas las canciones creadas por el usuario
    const result = await songsModel.deleteMany({ user: userId });

    // Verificar si se eliminaron canciones
    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "No se encontraron canciones para eliminar",
      });
      return;
    }

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} canciones eliminadas exitosamente`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar las canciones del usuario",
      error: error.message,
    });
  }
};

/**
 * @desc    Eliminar una canción específica creada por el usuario autenticado
 * @route   DELETE /api/songs/:id
 * @access  Privado (requiere autenticación)
 */
export const deleteMySong: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el ID del usuario autenticado desde req.user
    const userId = req.user?._id;
    // Validar que el userId esté presente
    // Validar que el usuario esté autenticado
    if (!userId) {
      res.status(401).json({ message: "No autorizado - Usuario no autenticado" });
      return;
    }

    // Obtener el ID de la canción desde los parámetros de la solicitud
    const { id: songId } = req.params;

    // Buscar la canción por ID
    const song = await songsModel.findById(songId);

    // Validar que la canción exista
    if (!song) {
      res.status(404).json({
        success: false,
        message: "Canción no encontrada",
      });
      return;
    }

    // Validar que el usuario autenticado sea el propietario de la canción
    if (song.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta canción",
      });
      return;
    }

    // Eliminar la canción
    await song.deleteOne();

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Canción eliminada exitosamente",
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "ID de canción inválido",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error al eliminar la canción",
      error: error.message,
    });
  }
};

/**
 * @desc    Actualizar una canción específica creada por el usuario autenticado
 * @route   PUT /api/songs/:id
 * @access  Privado (requiere autenticación)
 */
export const updateMySong: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el ID del usuario autenticado desde req.user
    const userId = req.user?._id;

    // Validar que el usuario esté autenticado
    if (!userId) {
      res.status(401).json({ message: "No autorizado - Usuario no autenticado" });
      return;
    }

    // Obtener el ID de la canción desde los parámetros de la solicitud
    const { id: songId } = req.params;

    // Buscar la canción por ID
    const song = await songsModel.findById(songId);

    // Validar que la canción exista
    if (!song) {
      res.status(404).json({
        success: false,
        message: "Canción no encontrada",
      });
      return;
    }

    // Validar que el usuario autenticado sea el propietario de la canción
    if (song.user.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar esta canción",
      });
      return;
    }

    // Actualizar los campos de la canción
    const { name, fileSong, fileScore, linkSong, category } = req.body;

    if (name) song.name = name;
    if (fileSong) song.fileSong = fileSong;
    if (fileScore) song.fileScore = fileScore;
    if (linkSong) song.linkSong = linkSong;
    if (category) song.category = category;

    // Guardar los cambios en la base de datos
    const updatedSong = await song.save();

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: "Canción actualizada exitosamente",
      data: updatedSong,
    });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({
        success: false,
        message: "ID de canción inválido",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Error al actualizar la canción",
      error: error.message,
    });
  }
};


