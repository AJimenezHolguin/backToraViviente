import mongoose, { Document, Schema } from "mongoose";

// Interfaz Song
export interface ISong extends Document {
  name: string;
  fileSong?: {
    public_id: string; secure_url: string
  };  // Archivo de la canción
  fileScore?: {
    public_id: string; secure_url: string
  };  // Partitura (para músicos)
  linkSong?: string;  // Enlace a la canción
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;  // El usuario administrador que crea la canción
  category?: string;  // Categoría de la canción (opcional)
}

// Esquema de Song
const SongSchema = new Schema<ISong>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },  // El usuario administrador
  fileSong: { type: {} },  // Puede ser la URL de la canción
  fileScore: { type: {} },  // Partitura (si es para músico)
  linkSong: { type: String },  // Enlace a la canción
  category: { type: String },  // Categoría de la canción (opcional)
});

export default mongoose.model<ISong>("Song", SongSchema);
