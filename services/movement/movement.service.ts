import { Request } from "express";
import { SupabaseQueryService } from "../supabaseQueryService";
import { Movements } from "../../types/movements";
import supabase from "../../db/supabaseClient";
import { applyMovementSearch } from "../../utils/helpers/movementSearch.helper";

export class MovementService {
  static async getAll(req: Request) {
    return await SupabaseQueryService.executeQuery<Movements>(req, supabase, {
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
    });
  }
}
