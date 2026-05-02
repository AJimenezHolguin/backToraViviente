"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const pagination_utils_1 = require("../../utils/pagination.utils");
const getAllUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const order = req.query.order || "DESC";
        const sortBy = req.query.sortBy || "createdAt";
        const search = req.query.search || "";
        const isActiveQuery = req.query.isActive;
        const skip = (page - 1) * take;
        let filter = {};
        // 🔎 búsqueda
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        // 🆕 filtro por estado
        if (isActiveQuery !== undefined) {
            filter.isActive = isActiveQuery === "true";
        }
        const [users, total] = await Promise.all([
            user_model_1.default.find(filter)
                .select("-password")
                .sort({ [sortBy]: order === "ASC" ? 1 : -1 })
                .skip(skip)
                .limit(take),
            user_model_1.default.countDocuments(filter),
        ]);
        const formattedUsers = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
        const metadata = (0, pagination_utils_1.buildMetadata)(page, take, total, order, sortBy, search);
        res.json({
            data: formattedUsers,
            metadata,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error obteniendo usuarios",
            error,
        });
    }
};
exports.getAllUsers = getAllUsers;
