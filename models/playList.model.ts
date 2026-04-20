import mongoose, { Document, Schema } from "mongoose";

export interface IPlaylist extends Document {
  name: string;
  createdBy: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaylistSchema = new Schema<IPlaylist>({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  status: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
