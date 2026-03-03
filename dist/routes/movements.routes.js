"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const auth_1 = require("../types/auth");
const validateRole_1 = require("../middleware/validateRole");
const createMovements_controller_1 = require("../controller/movements/createMovements.controller");
const getAllMovements_controller_1 = require("../controller/movements/getAllMovements.controller");
const updateMovements_controller_1 = require("../controller/movements/updateMovements.controller");
const anulledMovements_controller_1 = require("../controller/movements/anulledMovements.controller");
const router = (0, express_1.Router)();
router.post(`/movements/create`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), createMovements_controller_1.createMovements);
router.get(`/movements`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), getAllMovements_controller_1.getAllMovements);
router.post(`/movements/update/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), updateMovements_controller_1.updateMovements);
router.patch(`/movements/anulled/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), anulledMovements_controller_1.annulledMovements);
exports.default = router;
