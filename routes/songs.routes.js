"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CreateSong_controller_1 = require("../controller/songs/CreateSong.controller");
const validateRole_1 = require("../middleware/validateRole");
const auth_1 = require("../types/auth");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
// import { getSongs } from "../controller/songs/GetSongs.controller";
const router = (0, express_1.Router)();
router.post(`/songs/create/:userId`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), CreateSong_controller_1.createSong);
router.get(`/songs`, CreateSong_controller_1.getSongs);
router.get(`/songs/:id`, CreateSong_controller_1.getSongById);
router.get(`/songs/mysongs/:userId`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), CreateSong_controller_1.getSongsByUser);
router.delete(`/songs/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), CreateSong_controller_1.deleteMySong);
router.put(`/songs/:id`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), CreateSong_controller_1.updateMySong); // Update song (same as delete for now)
exports.default = router;
