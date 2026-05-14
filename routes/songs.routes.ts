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
import { validatePasswordChange } from "../middleware/validatePasswordChange";

const router = Router();

router.post(
  `/songs/create`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin, Roles.Musician]),
  createSong
);

router.get(
  `/songs/user`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin, Roles.Musician]),
  getSongsValidation,
  handlePaginationValidation,
  getSongsByUser
);

router.get(
  `/songs`,
  authMiddleware,
  validatePasswordChange,
  getSongsValidation,
  handlePaginationValidation,
  getAllSongs
);

router.get(
  `/songs/:id`, 
  authMiddleware, 
  validatePasswordChange,
  getSongById
);
router.delete(
  `/songs/:id`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin, Roles.Musician]),
  deleteMySong
);
router.put(
  `/songs/:id`,
  authMiddleware,
  validatePasswordChange,
  validateRole([Roles.Admin, Roles.Musician]),
  updateMySong
);

export default router;
