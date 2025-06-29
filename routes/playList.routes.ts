import { Router } from "express";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";
import { createPlaylist } from "../controller/playList/playlist.POST.controller";
import { allsPlaylist } from "../controller/playList/allsPlaylist.GET.controller";
import { userPlaylist } from "../controller/playList/userPlaylist.GET.controller";
import { updatePlaylist } from "../controller/playList/updatePlaylist.controller";
import { deletePlaylist } from "../controller/playList/deletePlaylist.controller";
import { getPlaylistById } from "../controller/playList/getPlaylistById.controller";

const router = Router();

router.post(`/playlists`, authMiddleware, validateRole([Roles.Admin]), (req, res, next) => {
    createPlaylist(req, res).catch(next);
});
router.get(`/playlists`, authMiddleware, (req, res, next) => {
    allsPlaylist(req, res).catch(next);
});
router.get(`/playlists/user`, authMiddleware, validateRole([Roles.Admin]), (req, res, next) => {
    userPlaylist(req, res).catch(next);
});
router.get(`/playlists/:playlistId`, authMiddleware, (req, res, next) => {
    getPlaylistById(req, res, next);
});
router.put(`/playlists/:playlistId`, authMiddleware, validateRole([Roles.Admin]), (req, res, next) => {
    updatePlaylist(req, res).catch(next);
});
router.delete(`/playlists/:playlistId`, authMiddleware, validateRole([Roles.Admin]), (req, res, next) => {
    deletePlaylist(req, res).catch(next);
});

export default router;
