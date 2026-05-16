"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const carScraper_1 = __importDefault(require("./carScraper"));
class ScraperScheduler {
    constructor() {
        this.cronJob = null;
    }
    start() {
        // Run every 6 hours: 0 0 */6 * * *
        // Also runs immediately on startup
        this.cronJob = node_cron_1.default.schedule("0 */6 * * *", async () => {
            console.log("🕐 Cron job triggered: Starting car price scraping...");
            try {
                await carScraper_1.default.scrapeAllBrands();
            }
            catch (error) {
                console.error("❌ Cron job error:", error);
            }
        });
        console.log("✅ Scraper scheduler started (runs every 6 hours)");
        // Run immediately on startup
        this.runNow();
    }
    async runNow() {
        console.log("🚀 Running scraper immediately on startup...");
        try {
            await carScraper_1.default.scrapeAllBrands();
        }
        catch (error) {
            console.error("❌ Immediate scraper error:", error);
        }
    }
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            console.log("⏹️ Scraper scheduler stopped");
        }
    }
}
exports.default = new ScraperScheduler();
//# sourceMappingURL=scraperScheduler.js.map