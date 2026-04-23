"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMovements = void 0;
const validateAccountingDate_1 = require("./../../utils/validateAccountingDate");
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
        const { date, description, type, monto, ref_id = null } = req.body;
        if (!date || !description || !type || monto === undefined) {
            return res.status(400).json({
                success: false,
                message: "Fecha, descripción, tipo y monto son obligatorios",
            });
        }
        const validationResult = (0, validateAccountingDate_1.validateAccountingDate)(date);
        if (!validationResult.valid) {
            return res.status(400).json({
                success: false,
                message: validationResult.message,
            });
        }
        const inputDate = validationResult.date;
        if (!["ingreso", "gasto"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Tipo inválido",
            });
        }
        const montoNumerico = Number(monto);
        if (isNaN(montoNumerico) || montoNumerico <= 0) {
            return res.status(400).json({
                success: false,
                message: "El monto debe ser mayor a 0",
            });
        }
        const { data: lastMovement, error: saldoError } = await supabaseClient_1.default
            .from("movements")
            .select("saldo, numReg")
            .order("numReg", { ascending: false })
            .limit(1)
            .maybeSingle();
        if (saldoError)
            throw saldoError;
        const saldoAnterior = lastMovement ? Number(lastMovement.saldo) : 0;
        const nextNumReg = (lastMovement?.numReg ?? 0) + 1;
        if (type === "gasto" && montoNumerico > saldoAnterior) {
            return res.status(400).json({
                success: false,
                message: "¡No es posible crear el asiento contable por Saldo insuficiente!",
            });
        }
        const ingreso = type === "ingreso" ? montoNumerico : null;
        const gasto = type === "gasto" ? montoNumerico : null;
        const nuevoSaldo = type === "ingreso"
            ? saldoAnterior + montoNumerico
            : saldoAnterior - montoNumerico;
        const { data, error } = await supabaseClient_1.default
            .from("movements")
            .insert([
            {
                numReg: nextNumReg,
                date: inputDate,
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
