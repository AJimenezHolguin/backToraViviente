import mongoose, { Document, Schema } from "mongoose";

// Interfaz Playlist
export interface IPlaylist extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId; // Administrador o usuario que creó la playlist
  songs: mongoose.Types.ObjectId[]; // Relación con canciones
  status: boolean; // Estado de la playlist (activa o no)
  createdAt: Date;
  updatedAt: Date;
}

// Esquema de Playlist
const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
