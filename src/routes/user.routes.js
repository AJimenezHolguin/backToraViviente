"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const deletUser_controller_1 = require("../controller/User/deletUser.controller");
const register_controller_1 = require("../controller/User/register.controller");
const login_controller_1 = require("../controller/User/login.controller");
const getUsers_controller_1 = require("../controller/User/getUsers.controller");
const router = (0, express_1.Router)();
router.post("/auth/register", register_controller_1.register);
router.post("/auth/login", login_controller_1.login);
router.get("/users", auth_middleware_1.default, getUsers_controller_1.getUsers);
router.delete("/users/:id", auth_middleware_1.default, deletUser_controller_1.deleteUser);
exports.default = router;
