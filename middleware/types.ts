import { Request } from "express";
import { Roles } from "../types/auth";

export interface AuthRequest extends Request {
    user?: {
      _id: string;
      name?: string;
      email?: string;
      role: Roles;
    };
  }