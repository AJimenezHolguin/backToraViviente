import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { Roles } from "../types/auth";
import { validateRole } from "../middleware/validateRole";
import { createMovements } from "../controller/movements/createMovements.controller";
import { getAllMovements } from "../controller/movements/getAllMovements.controller";
import { createAdjustment } from '../controller/movements/createAdjustment.controller';
import { annulledMovements } from "../controller/movements/anulledMovements.controller";
import { getMovementById } from '../controller/movements/getMovementById.controller';
import { getNextMovementNumReg } from "../controller/movements/getNextMovementNumReg.controller";
import { validatePasswordChange } from "../middleware/validatePasswordChange";

const router = Router();

router.post(
  `/movements/create`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  createMovements
);

router.get(
  `/movements`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  getAllMovements
);

router.get(
  `/movements/next-num-reg`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  getNextMovementNumReg 
);

router.get(
  `/movements/:id`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  getMovementById
);


router.post(
  `/movements/adjust/:id`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  createAdjustment
);

router.patch(
  `/movements/anulled/:id`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin]),
  annulledMovements
)

export default router;
