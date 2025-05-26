
import { Request, Response } from "express";
import userModel from "../../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
  const users = await userModel.find();
  res.json(users);
};
