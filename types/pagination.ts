export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PlaylistQueryParams {
    page: number;
    take: number;
    order: 'ASC' | 'DESC';
    search?: string;
    sortBy?: string;
}