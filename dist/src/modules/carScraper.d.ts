declare class CarScraper {
    private browser;
    private readonly USER_AGENT;
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    private createPage;
    private scrapeMaruti;
    private scrapeHyundai;
    private scrapeTata;
    private scrapeMahindra;
    private scrapeKia;
    private scrapeVolkswagen;
    private parsePrice;
    scrapeAllBrands(): Promise<void>;
}
declare const _default: CarScraper;
export default _default;
//# sourceMappingURL=carScraper.d.ts.map