"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementService = void 0;
const supabaseQueryService_1 = require("../supabaseQueryService");
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const movementSearch_helper_1 = require("../../utils/helpers/movementSearch.helper");
const user_model_1 = __importDefault(require("../../models/user.model"));
class MovementService {
    static async getAll(req) {
        const result = await supabaseQueryService_1.SupabaseQueryService.executeQuery(req, supabaseClient_1.default, {
            table: "movements",
            defaultSortField: "numReg",
            filters: (query, req) => {
                const { status, month, year, search } = req.query;
                query = (0, movementSearch_helper_1.applyMovementSearch)(query, search);
                if (status === "activo") {
                    query = query.eq("state", "activo");
                }
                if (status === "anulado") {
                    query = query.eq("state", "anulado");
                }
                if (status === "ajustado") {
                    query = query.eq("state", "ajustado");
                }
                if (month && year) {
                    const startDate = new Date(Number(year), Number(month) - 1, 1);
                    const endDate = new Date(Number(year), Number(month), 0);
                    query = query
                        .gte("date", startDate.toISOString())
                        .lte("date", endDate.toISOString());
                }
                return query;
            },
        });
        const userIds = Array.from(new Set(result.data.map((m) => m.user_uuid).filter(Boolean)));
        const users = await user_model_1.default
            .find({ _id: { $in: userIds } })
            .select("_id isActive");
        const userMap = new Map(users.map((u) => [String(u._id), u.isActive]));
        const enrichedData = result.data.map((movement) => ({
            ...movement,
            user_active: userMap.get(movement.user_uuid) ?? false,
        }));
        return {
            ...result,
            data: enrichedData,
        };
    }
}
exports.MovementService = MovementService;
