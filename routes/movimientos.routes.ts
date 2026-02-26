import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { Roles } from "../types/auth";
import { validateRole } from "../middleware/validateRole";

import { createMovimiento } from "../controller/movimientos/createMovimiento.controller";
import { getAllMovimientos } from "../controller/movimientos/getAllMovimientos.controller";
import { updateMovimiento } from "../controller/movimientos/updateMovimiento.controller";
import { anulledMovimiento } from "../controller/movimientos/anulledMovimiento.controller";


const router = Router();

router.post(
  `/movimientos/create`,
  authMiddleware,
  validateRole([Roles.Admin]),
  createMovimiento
);

router.get(
  `/movimientos`,
  authMiddleware,
  validateRole([Roles.Admin]),
  getAllMovimientos
);

router.put(
  `/movimientos/:id`,
  authMiddleware,
  validateRole([Roles.Admin]),
  updateMovimiento
);

router.patch(
  `/movimientos/:id/anulled`,
  authMiddleware,
  validateRole([Roles.Admin]),
  anulledMovimiento
)

export default router;
