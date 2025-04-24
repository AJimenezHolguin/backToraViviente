import User from "../../models/user.model";
import { Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuario eliminado" });
};
