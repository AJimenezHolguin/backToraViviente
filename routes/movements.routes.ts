import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { Roles } from "../types/auth";
import { validateRole } from "../middleware/validateRole";
import { createMovements } from "../controller/movements/createMovements.controller";
import { getAllMovements } from "../controller/movements/getAllMovements.controller";
import { updateMovements } from "../controller/movements/updateMovements.controller";
import { annulledMovements } from "../controller/movements/anulledMovements.controller";



const router = Router();

router.post(
  `/movements/create`,
  authMiddleware,
  validateRole([Roles.Admin]),
  createMovements
);

router.get(
  `/movements`,
  authMiddleware,
  validateRole([Roles.Admin]),
  getAllMovements
);

router.post(
  `/movements/update/:id`,
  authMiddleware,
  validateRole([Roles.Admin]),
  updateMovements
);

router.patch(
  `/movements/anulled/:id`,
  authMiddleware,
  validateRole([Roles.Admin]),
  annulledMovements
)

export default router;
