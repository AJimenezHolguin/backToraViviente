import { Request, Response } from "express";
import { BaseQueryParams } from "../../types/pagination";
import { PlaylistService } from "../../services/playlists/playlist.service";

export const userPlaylist = async (req: Request, res: Response) => {
  try {
    const userId = req.user ? (req.user as any)._id : null;

    const { page, take, order } = req.query as unknown as BaseQueryParams;

    if (page === undefined || take === undefined || order === undefined) {
      return res.status(400).json({
        success: false,
        message: "page, take, and order are mandatory query parameters",
        data: [],
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
        data: [],
      });
    }

    const pageNum = Number(page);
    const takeNum = Number(take);
    const orderStr = String(order).toUpperCase();

    if (
      isNaN(pageNum) ||
      isNaN(takeNum) ||
      pageNum < 1 ||
      takeNum < 1 ||
      (orderStr !== "ASC" && orderStr !== "DESC")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid page, take, or order parameters",
        data: [],
      });
    }

    const result = await PlaylistService.getByUser(req, userId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error fetching user playlists:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      data: [],
    });
  }
};
