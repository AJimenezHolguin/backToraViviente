
import { Router } from "express";

import { createSong, deleteMySong, getSongById, getSongs, getSongsByUser, updateMySong } from "../controller/songs/CreateSong.controller";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post(`/songs/create`, authMiddleware, validateRole([Roles.Admin]), createSong);
router.get(`/songs`, authMiddleware, getSongs);
router.get(`/songs/:id`, authMiddleware, getSongById);
router.get(`/songs/mysongs`, authMiddleware, validateRole([Roles.Admin]), getSongsByUser);
router.delete(`/songs/:id`, authMiddleware, validateRole([Roles.Admin]), deleteMySong);
router.put(`/songs/:id`, authMiddleware, validateRole([Roles.Admin]), updateMySong);

export default router;
