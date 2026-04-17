"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextMovementNumReg = void 0;
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const getNextMovementNumReg = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: "No autorizado",
            });
        }
        const { data, error } = await supabaseClient_1.default
            .from("movements")
            .select("numReg")
            .order("numReg", { ascending: false })
            .limit(1)
            .single();
        if (error && error.code !== "PGRST116") {
            return res.status(500).json({
                success: false,
                message: "Error al obtener el número de registro",
            });
        }
        const nextNumReg = data?.numReg ? data.numReg + 1 : 1;
        return res.status(200).json({
            success: true,
            message: "Siguiente número de registro obtenido",
            nextNumReg,
        });
    }
    catch (err) {
        console.error("Error getNextMovementNumReg:", err);
        return res.status(500).json({
            success: false,
            message: "Error interno del servidor",
        });
    }
};
exports.getNextMovementNumReg = getNextMovementNumReg;
