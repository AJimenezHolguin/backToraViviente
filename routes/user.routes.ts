import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";

import { deleteUser } from "../controller/User/deletUser.controller";
import { registerPublic } from "../controller/User/registerPublic.controller";
import { login } from "../controller/User/login.controller";
import { getUsers } from "../controller/User/getUsers.controller";

const router = Router();

router.post("/auth/register-public", registerPublic);
router.post("/auth/login", login);
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
