import User from "../models/user.model";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};
