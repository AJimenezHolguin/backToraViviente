import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { registerUserPublic } from "../controller/User/registerUserPublic.controller";
import { login } from "../controller/User/login.controller";
import { registerUserByAdmin } from "../controller/User/registerUserByAdmin.controller";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import { validatePasswordChange } from "../middleware/validatePasswordChange";
import { changePassword } from "../controller/User/changePassword.controller";
import { resetPasswordByAdmin } from "../controller/User/resetPasswordByAdmin.controller";
import { changeUserRole } from "../controller/User/changeUserRole.controller";
import { getAllUsers } from "../controller/User/getAllUsers.controller";
import { handlePaginationValidation, validatePaginationParams } from "../utils/pagination.validation";
import { deactivateUser } from "../controller/User/deactivateUser.controller";
import { reactivateUser } from "../controller/User/reactivateUser.controller";


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
  "/admin/users",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  validatePaginationParams,
  handlePaginationValidation,
  getAllUsers
);

router.put(
  "/admin/users/change-role",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  changeUserRole
);


router.delete(
  "/admin/users/:id",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  deactivateUser
);
router.patch(
  "/admin/users/:id/reactivate",
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  reactivateUser
);


export default router;
