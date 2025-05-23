
import { Router } from "express";

import { createSong,  deleteMySong,  getSongById, getSongs, getSongsByUser, updateMySong } from "../controller/songs/CreateSong.controller";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";

// import { getSongs } from "../controller/songs/GetSongs.controller";
const router = Router();

router.post(`/songs/create/:userId`, authMiddleware, validateRole([Roles.Admin]), createSong);
router.get(`/songs`, getSongs);
router.get(`/songs/:id`, getSongById);
router.get(`/songs/mysongs/:userId`, authMiddleware, validateRole([Roles.Admin]), getSongsByUser);
router.delete(`/songs/:id`, authMiddleware, validateRole([Roles.Admin]), deleteMySong);
router.put(`/songs/:id`, authMiddleware, validateRole([Roles.Admin]), updateMySong); // Update song (same as delete for now)

export default router;
