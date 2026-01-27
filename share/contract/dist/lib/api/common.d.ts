export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
}
//# sourceMappingURL=common.d.ts.map