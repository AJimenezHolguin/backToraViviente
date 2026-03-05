"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovements = void 0;
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const createMovements = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No autorizado",
            });
        }
        const { date, description, type, monto, ref_id = null, } = req.body;
        // 🔎 Validaciones básicas
        if (!date || !description || !type || !monto) {
            return res.status(400).json({
                success: false,
                message: "Fecha, descripción, tipo y monto son obligatorios",
            });
        }
        if (new Date(date) > new Date()) {
            return res.status(400).json({
                success: false,
                message: "La fecha no puede ser futura",
            });
        }
        if (!["ingreso", "gasto"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Tipo inválido",
            });
        }
        if (Number(monto) <= 0) {
            return res.status(400).json({
                success: false,
                message: "El monto debe ser mayor a 0",
            });
        }
        const { data: lastSaldo, error: saldoError } = await supabaseClient_1.default
            .from("movements")
            .select("saldo")
            .order("numReg", { ascending: false })
            .limit(1)
            .maybeSingle();
        if (saldoError)
            throw saldoError;
        const saldoAnterior = lastSaldo ? Number(lastSaldo.saldo) : 0;
        const montoNumerico = Number(monto);
        const ingreso = type === "ingreso" ? montoNumerico : 0;
        const gasto = type === "gasto" ? montoNumerico : 0;
        const nuevoSaldo = saldoAnterior + ingreso - gasto;
        const { data, error } = await supabaseClient_1.default
            .from("movements")
            .insert([
            {
                date,
                description,
                type,
                ingreso,
                gasto,
                saldo: nuevoSaldo,
                state: "activo",
                ref_id,
                user_uuid: user._id,
                user_name: user.name,
                user_email: user.email,
            },
        ])
            .select()
            .single();
        if (error)
            throw error;
        return res.status(201).json({
            success: true,
            message: "Movimiento creado exitosamente",
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al crear movimiento",
            error: error.message,
        });
    }
};
exports.createMovements = createMovements;
