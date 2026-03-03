"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePaginationParams = void 0;
exports.handlePaginationValidation = handlePaginationValidation;
const express_validator_1 = require("express-validator");
exports.validatePaginationParams = [
    (0, express_validator_1.query)("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("page debe ser un entero mayor a 0")
        .toInt(),
    (0, express_validator_1.query)("take")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("take debe ser un entero entre 1 y 100")
        .toInt(),
    (0, express_validator_1.query)("order")
        .optional()
        .isIn(["ASC", "DESC"])
        .withMessage("order debe ser ASC o DESC"),
    (0, express_validator_1.query)("sortBy").optional().isString().trim(),
    (0, express_validator_1.query)("search").optional().isString().trim(),
];
function handlePaginationValidation(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Parámetros de paginación inválidos",
            errors: errors.array(),
        });
    }
    next();
}
