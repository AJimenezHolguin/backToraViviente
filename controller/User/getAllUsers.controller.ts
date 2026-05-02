
import { Response } from "express";
import User from "../../models/user.model";
import { buildMetadata } from "../../utils/pagination.utils";
import { AuthRequest } from "../../middleware/types";

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;
    const order = (req.query.order as "ASC" | "DESC") || "DESC";
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const search = (req.query.search as string) || "";
    
    const isActiveQuery = req.query.isActive as string | undefined;

    const skip = (page - 1) * take;

    let filter: any = {};

    // 🔎 búsqueda
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🆕 filtro por estado
    if (isActiveQuery !== undefined) {
      filter.isActive = isActiveQuery === "true";
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ [sortBy]: order === "ASC" ? 1 : -1 })
        .skip(skip)
        .limit(take),

      User.countDocuments(filter),
    ]);

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    const metadata = buildMetadata(
      page,
      take,
      total,
      order,
      sortBy,
      search
    );

    res.json({
      data: formattedUsers,
      metadata,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo usuarios",
      error,
    });
  }
};