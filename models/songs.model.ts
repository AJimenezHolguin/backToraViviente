import mongoose, { Document, Schema } from "mongoose";

export interface ISong extends Document {
  name: string;
  fileSong?: {
    public_id: string;
    secure_url: string;
  };
  fileScore?: {
    public_id: string;
    secure_url: string;
  };
  linkSong?: string;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;
  category?: string;
}

const SongSchema = new Schema<ISong>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileSong: {
    public_id: { type: String },
    secure_url: { type: String },
  },
  fileScore: {
    public_id: { type: String },
    secure_url: { type: String },
  },
  linkSong: { type: String },
  category: { type: String },
});

export default mongoose.model<ISong>("Song", SongSchema);
