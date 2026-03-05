"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMovements = void 0;
const supabaseClient_1 = __importDefault(require("../../db/supabaseClient"));
const updateMovements = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const { type, monto, description } = req.body;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No autorizado",
            });
        }
        if (!type || !["ingreso", "gasto"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Tipo debe ser 'ingreso' o 'gasto'",
            });
        }
        if (!monto || Number(monto) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Monto inválido",
            });
        }
        const { data: original, error: errorOriginal } = await supabaseClient_1.default
            .from("movements")
            .select("*")
            .eq("id", id)
            .single();
        if (errorOriginal || !original) {
            return res.status(404).json({
                success: false,
                message: "Movimiento original no encontrado",
            });
        }
        if (original.state === "anulado") {
            return res.status(400).json({
                success: false,
                message: "No se puede ajustar un movimiento anulado",
            });
        }
        // 2️⃣ Obtener último saldo
        const { data: ultimoMovimiento } = await supabaseClient_1.default
            .from("movements")
            .select("saldo, numReg")
            .order("numReg", { ascending: false })
            .limit(1)
            .single();
        const ultimoSaldo = ultimoMovimiento
            ? Number(ultimoMovimiento.saldo)
            : 0;
        const montoNumerico = Number(monto);
        const nuevoSaldo = type === "ingreso"
            ? ultimoSaldo + montoNumerico
            : ultimoSaldo - montoNumerico;
        const descripcionUsuario = description
            ? description.trim()
            : "Ajuste contable";
        const descripcionFinal = `${descripcionUsuario} (Ajuste del asiento #${original.numReg})`;
        const { data: ajuste, error: errorAjuste } = await supabaseClient_1.default
            .from("movements")
            .insert([
            {
                date: new Date(),
                description: descripcionFinal,
                type: "ajuste",
                ingreso: type === "ingreso" ? montoNumerico : 0,
                gasto: type === "gasto" ? montoNumerico : 0,
                saldo: nuevoSaldo,
                state: "activo",
                ref_id: original.id,
                user_uuid: user._id,
                user_name: user.name,
                user_email: user.email,
            },
        ])
            .select()
            .single();
        if (errorAjuste)
            throw errorAjuste;
        return res.status(201).json({
            success: true,
            message: "Ajuste generado correctamente",
            data: ajuste,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al generar ajuste",
            error: error.message,
        });
    }
};
exports.updateMovements = updateMovements;
