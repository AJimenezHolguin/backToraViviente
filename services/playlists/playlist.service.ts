import { Request } from "express";
import { QueryService } from "../queryService";
import { applyPlaylistSearch } from "../../utils/helpers/playlistSearch.helper";
import playlistModel from "../../models/playList.model";

export class PlaylistService {
  //
  static async getAll(req: Request) {
    return await QueryService.executeQuery(req, playlistModel, {
      defaultSortField: "name",

      populate: [{ path: "songs" }, { path: "createdBy", select: "name" }],

      filters: (query, req) => {
        return applyPlaylistSearch(query, req.query.search as string);
      },
    });
  }

  static async getByUser(req: Request, userId: string) {
    return await QueryService.executeQuery(req, playlistModel, {
      defaultSortField: "name",
      userId,
      userField: "createdBy",

      populate: [{ path: "songs" }, { path: "createdBy", select: "name" }],

      filters: (query, req) => {
        return applyPlaylistSearch(query, req.query.search as string);
      },
    });
  }
}
