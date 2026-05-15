import { Request } from "express";
import { SupabaseQueryService } from "../supabaseQueryService";
import { Movements } from "../../types/movements";
import supabase from "../../db/supabaseClient";
import { applyMovementSearch } from "../../utils/helpers/movementSearch.helper";
import userModel from "../../models/user.model";

export class MovementService {
  static async getAll(req: Request) {
    const result = await SupabaseQueryService.executeQuery<Movements>(
      req,
      supabase,
      {
        table: "movements",
        defaultSortField: "numReg",

        filters: (query, req) => {
          const { status, month, year, search } = req.query;

          query = applyMovementSearch(query, search as string);

          if (status === "activo") {
            query = query.eq("state", "activo");
          }

          if (status === "anulado") {
            query = query.eq("state", "anulado");
          }

          if (status === "ajustado") {
            query = query.eq("state", "ajustado");
          }

          if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0);

            query = query
              .gte("date", startDate.toISOString())
              .lte("date", endDate.toISOString());
          }

          return query;
        },
      }
    );

    const userIds = Array.from(
      new Set(result.data.map((m) => m.user_uuid).filter(Boolean))
    );

    const users = await userModel
      .find({ _id: { $in: userIds } })
      .select("_id isActive");

    const userMap = new Map(users.map((u) => [String(u._id), u.isActive]));

    const enrichedData = result.data.map((movement) => ({
      ...movement,
      user_active: userMap.get(movement.user_uuid) ?? false,
    }));

    return {
      ...result,
      data: enrichedData,
    };
  }
}
