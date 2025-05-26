import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

const SALT_ROUNDS = 10;
const SECRET_KEY = process.env.JWT_SECRET as string;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: IUser): string => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET_KEY, {
    expiresIn: "2h",
  });
};
