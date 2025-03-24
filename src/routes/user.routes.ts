import { Router } from "express";
import { deleteUser, getUsers, login, register } from "../controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
