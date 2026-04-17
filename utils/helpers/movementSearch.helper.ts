export const applyMovementSearch = (query: any, search?: string) => {
    if (!search) return query;
  
    const num = Number(search);
  
    if (isNaN(num)) {
      return query.eq("id", -1);
    }
  
    return query.eq("numReg", num);
  };