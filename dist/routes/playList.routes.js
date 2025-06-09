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
const allsPlaylist_GET_controller_1 = require("../controller/playList/allsPlaylist.GET.controller");
const userPlaylist_GET_controller_1 = require("../controller/playList/userPlaylist.GET.controller");
const router = (0, express_1.Router)();
router.post(`/playlists`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), (req, res, next) => {
    (0, playlist_POST_controller_1.createPlaylist)(req, res).catch(next);
});
router.get(`/playlists`, auth_middleware_1.default, (req, res, next) => {
    (0, allsPlaylist_GET_controller_1.allsPlaylist)(req, res).catch(next);
});
router.get(`/playlists/user`, auth_middleware_1.default, (0, validateRole_1.validateRole)([auth_1.Roles.Admin]), (req, res, next) => {
    (0, userPlaylist_GET_controller_1.userPlaylist)(req, res).catch(next);
});
exports.default = router;
