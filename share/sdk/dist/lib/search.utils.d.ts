import { SearchParams, PaginatedResult } from '../../share/contract/src/index.ts';
export declare class SearchUtils {
    static buildQuery(params: SearchParams): string;
    static createPaginatedResult<T>(data: T[], total: number, page: number, limit: number): PaginatedResult<T>;
}
//# sourceMappingURL=search.utils.d.ts.map