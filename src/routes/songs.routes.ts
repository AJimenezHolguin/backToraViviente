
import { Router } from "express";

import { createSong, getSongById, getSongs } from "../controller/songs/CreateSong.controller";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";

// import { getSongs } from "../controller/songs/GetSongs.controller";
const router = Router();

router.post(`/songs/create/:userId`, authMiddleware, validateRole([Roles.Admin]), createSong);
router.get(`/songs`, getSongs);
router.get(`/songs/:id`, getSongById);
export default router;
