
import { Router } from "express";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";
import { createPlaylist } from "../controller/playList/playlist.POST.controller";

const router = Router();

router.post(`/playlists`, authMiddleware, validateRole([Roles.Admin]), createPlaylist);

export default router;
