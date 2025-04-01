import mongoose, { Document, Schema } from "mongoose";

// Interfaz Song
export interface ISong extends Document {
  name: string;
  fileSong?: string;  // Archivo de la canción
  fileScore?: string;  // Partitura (para músicos)
  linkSong?: string;  // Enlace a la canción
  createdAt: Date;
  updatedAt: Date;
  status: boolean;  // Si la canción está activa o no
  user: mongoose.Types.ObjectId;  // El usuario administrador que crea la canción
  isForUser: boolean;  // Indica si la canción es para usuarios finales
  isForMusician: boolean;  // Indica si la canción tiene partituras para músicos
}

// Esquema de Song
const SongSchema = new Schema<ISong>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },  // Activa o inactiva
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },  // El usuario administrador
  fileSong: { type: String },  // Puede ser la URL de la canción
  fileScore: { type: String },  // Partitura (si es para músico)
  linkSong: { type: String },  // Enlace a la canción
  isForUser: { type: Boolean, default: true },  // Si es accesible para usuarios finales
  isForMusician: { type: Boolean, default: false },  // Si tiene partituras para músicos
});

export default mongoose.model<ISong>("Song", SongSchema);
