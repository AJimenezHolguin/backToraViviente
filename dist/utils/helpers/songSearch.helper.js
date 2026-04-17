"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applySongSearch = void 0;
const applySongSearch = (query, search) => {
    if (!search)
        return query;
    return {
        ...query,
        $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
        ],
    };
};
exports.applySongSearch = applySongSearch;
