"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRole_1 = require("../middleware/validateRole");
const auth_1 = require("../types/auth");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const playlist_POST_controller_1 = require("../controller/playList/playlist.POST.controller");
const router = (0, express_1.Router)();
router.post(`/playlists`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), playlist_POST_controller_1.createPlaylist);
exports.default = router;
