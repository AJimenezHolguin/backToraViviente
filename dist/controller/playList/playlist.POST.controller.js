"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlaylist = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
const createPlaylist = async (req, res) => {
    try {
        const { name, songs, status } = req.body;
        const userId = req.user?._id;
        const playlist = new playList_model_1.default({ name: name, songs: songs, status: status, createdBy: userId });
        const savedPlaylist = await playlist.save();
        if (!savedPlaylist) {
            res.status(400).json({ message: "Error al crear la playlist" });
            return;
        }
        res.status(201).json({ message: "Playlist creada exitosamente", playlist: savedPlaylist });
    }
    catch (error) {
        res.status(500).json({ message: "Error al crear la playlist", error });
    }
};
exports.createPlaylist = createPlaylist;
