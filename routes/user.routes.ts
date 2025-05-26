import { Router } from "express";
<<<<<<< HEAD
import { deleteUser, getUsers, login, register } from "../controller/user.controller";
import authMiddleware from "../middleware/auth.middleware";


const router = Router();

router.post("/register", register);
router.post("/login", login);
=======
import authMiddleware from "../middleware/auth.middleware";

import { deleteUser } from "../controller/User/deletUser.controller";
import { register } from "../controller/User/register.controller";
import { login } from "../controller/User/login.controller";
import { getUsers } from "../controller/User/getUsers.controller";


const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login)
>>>>>>> 9726a4c12b76eb8d283a1fc93101182ee6b15d5c
router.get("/users", authMiddleware, getUsers);
router.delete("/users/:id", authMiddleware, deleteUser);

export default router;
