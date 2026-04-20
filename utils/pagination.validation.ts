import { query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validatePaginationParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page debe ser un entero mayor a 0")
    .toInt(),

  query("take")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("take debe ser un entero entre 1 y 100")
    .toInt(),

  query("order")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("order debe ser ASC o DESC"),

  query("sortBy").optional().isString().trim(),

  query("search").optional().isString().trim(),
];

export function handlePaginationValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Parámetros de paginación inválidos",
      errors: errors.array(),
    });
  }

  next();
}
