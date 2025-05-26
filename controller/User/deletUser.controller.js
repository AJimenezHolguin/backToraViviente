"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const deleteUser = async (req, res) => {
    await user_model_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
};
exports.deleteUser = deleteUser;
