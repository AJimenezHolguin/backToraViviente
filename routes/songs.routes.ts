import { Router } from "express";
import { validateRole } from "../middleware/validateRole";
import { Roles } from "../types/auth";
import authMiddleware from "../middleware/auth.middleware";
import { deleteMySong } from "../controller/songs/deleteSong.controller";
import { getSongById } from "../controller/songs/getSongById.controller";
import {
  getAllSongs,
  getSongsValidation,
} from "../controller/songs/getAllSongs.controller";
import { getSongsByUser } from "../controller/songs/getSongsByUser.controller";
import { updateMySong } from "../controller/songs/updateSong.controller";
import { createSong } from "../controller/songs/CreateSong.controllerr";
import { handlePaginationValidation } from "../utils/pagination.validation";

const router = Router();

router.post(
  `/songs/create`,
  authMiddleware,
  validateRole([Roles.Admin]),
  createSong
);

router.get(
  `/songs/user`,
  authMiddleware,
  validateRole([Roles.Admin]),
  getSongsValidation,
  handlePaginationValidation,
  getSongsByUser
);

router.get(
  `/songs`,
  authMiddleware,
  getSongsValidation,
  handlePaginationValidation,
  getAllSongs
);

router.get(`/songs/:id`, authMiddleware, getSongById);
router.delete(
  `/songs/:id`,
  authMiddleware,
  validateRole([Roles.Admin]),
  deleteMySong
);
router.put(
  `/songs/:id`,
  authMiddleware,
  validateRole([Roles.Admin]),
  updateMySong
);

export default router;
