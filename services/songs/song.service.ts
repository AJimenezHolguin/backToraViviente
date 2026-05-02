import songsModel from "../../models/songs.model";
import { applySongSearch } from "../../utils/helpers/songSearch.helper";
import { QueryService } from "../queryService";
import { Request } from "express";

export class SongService {
  static async getAll(req: Request) {
    const result = await QueryService.executeQuery(req, songsModel, {
      defaultSortField: "name",

      populate: [
        {
          path: "user",
          match: { isActive: true },
          select: "name"
        }
      ],

      filters: (query, req) => {
        return applySongSearch(query, req.query.search as string);
      },
    });

    return {
      ...result,
      data: result.data.map((song: any) => ({
        ...song,
        userName: song.user?.name || "N/A",
        user: undefined,
      })),
    };
  }

  static async getByUser(req: Request, userId: string) {
    const result = await QueryService.executeQuery(req, songsModel, {
      defaultSortField: "name",
      userId,
      userField: "user",

      populate: [{ path: "user", select: "name" }],

      filters: (query, req) => {
        return applySongSearch(query, req.query.search as string);
      },
    });

    return {
      ...result,
      data: result.data.map((song: any) => ({
        ...song,
        userName: song.user?.name || "N/A",
        user: undefined,
      })),
    };
  }
}
