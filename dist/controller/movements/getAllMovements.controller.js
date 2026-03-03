"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMovements = void 0;
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const supabaseQueryService_1 = require("../../services/supabaseQueryService");
const getAllMovements = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "No autorizado",
        });
    }
    try {
        const result = await supabaseQueryService_1.SupabaseQueryService.executeQuery(req, supabaseClient_1.default, {
            table: "movimientos",
            defaultSortField: "numero_registro",
            filters: (query, req) => {
                const { status, month, year } = req.query;
                if (status === "activo") {
                    query = query.eq("estado", "activo");
                }
                if (status === "anulado") {
                    query = query.eq("estado", "anulado");
                }
                if (month && year) {
                    const startDate = new Date(Number(year), Number(month) - 1, 1);
                    const endDate = new Date(Number(year), Number(month), 0);
                    query = query
                        .gte("fecha", startDate.toISOString())
                        .lte("fecha", endDate.toISOString());
                }
                return query;
            },
        });
        return res.status(200).json({
            success: true,
            message: "Movimientos obtenidos exitosamente",
            ...result,
        });
    }
    catch (error) {
        console.error("ERROR GET MOVIMIENTOS:", error);
        return res.status(500).json({
            success: false,
            message: "Error al obtener movimientos",
            error: error?.message || error,
        });
    }
};
exports.getAllMovements = getAllMovements;
