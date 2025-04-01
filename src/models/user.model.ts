import mongoose, { Document, Schema } from "mongoose";
import { Roles } from "../types/auth";

const RolesArray = Object.values(Roles) as string[];


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role?: Roles;
  createdAt?: Date;
  updatedAt?: Date;
  playlists?: mongoose.Types.ObjectId[];
}


const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Roles), 
    default: Roles.User, 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist" }], 
});

export default mongoose.model<IUser>("User", UserSchema);
