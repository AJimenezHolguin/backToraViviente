import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { deleteUser } from "../controller/User/deletUser.controller";
import { registerUserPublic } from "../controller/User/registerUserPublic.controller";
import { login } from "../controller/User/login.controller";
import { getUsers } from "../controller/User/getUsers.controller";
import { registerUserByAdmin } from "../controller/User/registerUserByAdmin.controller";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import { validatePasswordChange } from "../middleware/validatePasswordChange";

const router = Router();

router.post(
  "/auth/register-admin",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  registerUserByAdmin
);

router.post("/auth/register-public", registerUserPublic);
router.post("/auth/login", login);

router.get(
  "/users",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  getUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  deleteUser
);

export default router;
