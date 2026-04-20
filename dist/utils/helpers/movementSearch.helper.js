"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMovementSearch = void 0;
const applyMovementSearch = (query, search) => {
    if (!search)
        return query;
    const num = Number(search);
    if (isNaN(num)) {
        return query.eq("id", -1);
    }
    return query.eq("numReg", num);
};
exports.applyMovementSearch = applyMovementSearch;
