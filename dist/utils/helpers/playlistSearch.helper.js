"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPlaylistSearch = void 0;
const applyPlaylistSearch = (query, search) => {
    if (!search)
        return query;
    return {
        ...query,
        $or: [
            { name: { $regex: search, $options: "i" } },
        ],
    };
};
exports.applyPlaylistSearch = applyPlaylistSearch;
