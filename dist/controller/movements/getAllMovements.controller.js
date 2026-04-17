"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMovements = void 0;
const movement_service_1 = require("../../services/movement/movement.service");
const getAllMovements = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "No autorizado",
        });
    }
    try {
        const result = await movement_service_1.MovementService.getAll(req);
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
