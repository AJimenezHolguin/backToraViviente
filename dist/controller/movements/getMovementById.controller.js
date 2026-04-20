"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovementById = void 0;
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const getMovementById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user) {
            return res.status(400).json({
                success: false,
                message: 'No autorizado',
            });
        }
        if (!id) {
            return res.status(401).json({
                success: false,
                message: 'El id es requerido',
            });
        }
        const { data, error } = await supabaseClient_1.default
            .from('movements')
            .select(`
            id,
            date,
            numReg,
            description,
            type,
            ingreso,
            gasto,
            saldo,
            state,
            ref_id,
            user_uuid,
            user_name,
            user_email,
            created_at
          `)
            .eq('id', id)
            .single();
        if (error || !data) {
            return res.status(404).json({
                success: false,
                message: 'Asiento no encontrado',
            });
        }
        const movement = data;
        return res.status(200).json({
            success: true,
            message: 'Movimiento obtenido exitosamente',
            data: movement,
        });
    }
    catch (err) {
        console.error('Error getMovementById:', err);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
exports.getMovementById = getMovementById;
