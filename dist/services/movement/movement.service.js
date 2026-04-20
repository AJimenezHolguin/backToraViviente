"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementService = void 0;
const supabaseQueryService_1 = require("../supabaseQueryService");
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const movementSearch_helper_1 = require("../../utils/helpers/movementSearch.helper");
class MovementService {
    static async getAll(req) {
        return await supabaseQueryService_1.SupabaseQueryService.executeQuery(req, supabaseClient_1.default, {
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
    }
}
exports.MovementService = MovementService;
