export type OrderDirection = "ASC" | "DESC";

export interface PaginationMetadata {
  page: number;
  take: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  order: OrderDirection;
  sortBy: string;
  search: string;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: PaginationMetadata;
}

export interface BaseQueryParams {
  page?: string;
  take?: string;
  order?: OrderDirection;
  sortBy?: string;
  search?: string;
}