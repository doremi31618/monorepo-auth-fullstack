import { ApiResponse } from '../../../share/contract/src/index.ts';
export type HttpClientOptions<T> = {
    useLocalStorage?: boolean;
    storageKey?: string;
    refreshPath?: string;
    initialSession?: T;
};
export declare class HttpClient<T = {
    token?: string;
}> {
    private baseUrl;
    private refreshPath;
    private storage;
    constructor(baseUrl: string, options?: HttpClientOptions<T>);
    private get token();
    private get authorizationHeader();
    private updateSession;
    private safeParse;
    private safeErrorMessage;
    private refreshToken;
    private pendingRefresh;
    private _refreshToken;
    private rawRequest;
    private request;
    get<R>(path: string): Promise<ApiResponse<R>>;
    post<R>(path: string, data: unknown): Promise<ApiResponse<R>>;
    put<R>(path: string, data: unknown): Promise<ApiResponse<R>>;
    delete<R>(path: string): Promise<ApiResponse<R>>;
}
//# sourceMappingURL=httpClient.d.ts.map