// routes/songs.routes.ts
import { Router } from "express";
// ✅ Correcto
import { createSong } from "../controller/songs/CreateSong.controller";

// import { getSongs } from "../controller/songs/GetSongs.controller";
const router = Router();

router.post("/songs/create", createSong);

export default router;
