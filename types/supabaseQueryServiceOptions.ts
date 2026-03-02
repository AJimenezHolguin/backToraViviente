import type { Request } from 'express';

export interface SupabaseQueryOptions {
    table: string;
    defaultSortField?: string;
    filters?: (query: any, req: Request) => any;
} 