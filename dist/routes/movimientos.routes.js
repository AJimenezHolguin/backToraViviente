"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const auth_1 = require("../types/auth");
const validateRole_1 = require("../middleware/validateRole");
const createMovimiento_controller_1 = require("../controller/movimientos/createMovimiento.controller");
const getAllMovimientos_controller_1 = require("../controller/movimientos/getAllMovimientos.controller");
const updateMovimiento_controller_1 = require("../controller/movimientos/updateMovimiento.controller");
const anulledMovimiento_controller_1 = require("../controller/movimientos/anulledMovimiento.controller");
const router = (0, express_1.Router)();
router.post(`/movimientos/create`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), createMovimiento_controller_1.createMovimiento);
router.get(`/movimientos`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), getAllMovimientos_controller_1.getAllMovimientos);
router.post(`/movimientos/ajustar/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), updateMovimiento_controller_1.updateMovimiento);
router.patch(`/movimientos/anulled/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), anulledMovimiento_controller_1.annulledMovimiento);
exports.default = router;
