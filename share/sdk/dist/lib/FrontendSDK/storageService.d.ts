declare class StorageService<T> {
    private useLocalStorage;
    private STORAGE_KEY;
    private container;
    constructor(initContent: T, storageKey?: string);
    get content(): T | null;
    set content(value: T);
    remove(): void;
}
export default StorageService;
//# sourceMappingURL=storageService.d.ts.map