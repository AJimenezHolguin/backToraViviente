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
import { changePassword } from "../controller/User/changePassword.controller";
import { resetPasswordByAdmin } from "../controller/User/resetPasswordByAdmin.controller";

const router = Router();

router.post(
  "/auth/register-admin",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  registerUserByAdmin
);

router.post("/auth/register-public", registerUserPublic);

router.put(
  "/auth/change-password",
  authMiddleware,
  changePassword
)

router.post("/auth/login", login);

router.put(
  "/admin/users/reset-password",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  resetPasswordByAdmin
)

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
