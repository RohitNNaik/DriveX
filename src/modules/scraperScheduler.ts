import cron from "node-cron";
import carScraper from "./carScraper";

class ScraperScheduler {
  private cronJob: any = null;

  start(): void {
    // Run every 6 hours: 0 0 */6 * * *
    // Also runs immediately on startup
    this.cronJob = cron.schedule("0 */6 * * *", async () => {
      console.log("🕐 Cron job triggered: Starting car price scraping...");
      try {
        await carScraper.scrapeAllBrands();
      } catch (error) {
        console.error("❌ Cron job error:", error);
      }
    });

    console.log("✅ Scraper scheduler started (runs every 6 hours)");

    // Run immediately on startup
    this.runNow();
  }

  async runNow(): Promise<void> {
    console.log("🚀 Running scraper immediately on startup...");
    try {
      await carScraper.scrapeAllBrands();
    } catch (error) {
      console.error("❌ Immediate scraper error:", error);
    }
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log("⏹️ Scraper scheduler stopped");
    }
  }
}

export default new ScraperScheduler();
