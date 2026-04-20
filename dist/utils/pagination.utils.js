"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMetadata = buildMetadata;
function buildMetadata(page, take, total, order, sortBy, search) {
    const pageCount = total > 0 ? Math.ceil(total / take) : 0;
    return {
        page,
        take,
        total,
        pageCount,
        hasPreviousPage: page > 1,
        hasNextPage: page < pageCount,
        order,
        sortBy,
        search,
    };
}
