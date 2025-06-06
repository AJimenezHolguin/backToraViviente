"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRole_1 = require("../middleware/validateRole");
const auth_1 = require("../types/auth");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const queryService_1 = require("../services/queryService");
const deleteSong_controller_1 = require("../controller/songs/deleteSong.controller");
const getSongById_controller_1 = require("../controller/songs/getSongById.controller");
const getSongs_controller_1 = require("../controller/songs/getSongs.controller");
const getSongsByUser_controller_1 = require("../controller/songs/getSongsByUser.controller");
const updateSong_controller_1 = require("../controller/songs/updateSong.controller");
const CreateSong_controllerr_1 = require("../controller/songs/CreateSong.controllerr");
const router = (0, express_1.Router)();
router.post(`/songs/create`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), CreateSong_controllerr_1.createSong);
router.get(`/songs/user`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), ...getSongsByUser_controller_1.getSongsByUserValidation, // Spread the validation middleware
queryService_1.QueryService.handleValidationErrors, // Middleware de manejo de errores
getSongsByUser_controller_1.getSongsByUser);
router.get(`/songs`, auth_middleware_1.default, ...getSongs_controller_1.getSongsValidation, // Spread the validation middleware
queryService_1.QueryService.handleValidationErrors, // Middleware de manejo de errores
getSongs_controller_1.getSongs);
router.get(`/songs/:id`, auth_middleware_1.default, getSongById_controller_1.getSongById);
router.delete(`/songs/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), deleteSong_controller_1.deleteMySong);
router.put(`/songs/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), updateSong_controller_1.updateMySong);
exports.default = router;
