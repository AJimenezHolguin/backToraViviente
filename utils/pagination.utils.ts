import { OrderDirection, PaginationMetadata } from "../types/pagination";


export function buildMetadata(
  page: number,
  take: number,
  total: number,
  order: OrderDirection,
  sortBy: string,
  search: string
): PaginationMetadata {
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