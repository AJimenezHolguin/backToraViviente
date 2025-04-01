import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { register } from "../controller/register.controller";
import { login } from "../controller/login.controller";
import { getUsers } from "../controller/getUsers.controller";
import { deleteUser } from "../controller/deletUser.controller";


const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login)
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
