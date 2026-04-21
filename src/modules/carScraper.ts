import { chromium, Browser, Page } from "playwright";
import ScrapedCarPrice from "../models/ScrapedCarPrice";

interface ScrapedData {
  brand: string;
  model: string;
  variant: string;
  price: number;
  url: string;
}

class CarScraper {
  private browser: Browser | null = null;
  private readonly USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await chromium.launch();
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error("Browser not initialized. Call initialize() first.");
    }
    return await this.browser.newPage({
      userAgent: this.USER_AGENT,
    });
  }

  // Maruti Suzuki scraper
  private async scrapeMaruti(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.maruti.co.in/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      // Example selector - adjust based on actual website structure
      const cars = await page.locator('[data-testid="car-card"]').all();

      for (const car of cars) {
        try {
          const name = await car.locator('[data-testid="car-name"]').textContent();
          const price = await car
            .locator('[data-testid="car-price"]')
            .textContent();
          const variant = await car
            .locator('[data-testid="car-variant"]')
            .textContent();

          if (name && price) {
            results.push({
              brand: "Maruti Suzuki",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.maruti.co.in",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Maruti:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  // Hyundai scraper
  private async scrapeHyundai(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.hyundaiindia.com/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const cars = await page.locator('[class*="car-item"]').all();

      for (const car of cars) {
        try {
          const name = await car.locator("[class*='car-name']").textContent();
          const price = await car
            .locator("[class*='price']")
            .textContent();
          const variant = await car
            .locator("[class*='variant']")
            .textContent();

          if (name && price) {
            results.push({
              brand: "Hyundai",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.hyundaiindia.com",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Hyundai:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  // Tata scraper
  private async scrapeTata(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.tatamotors.com/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const cars = await page.locator('[data-car]').all();

      for (const car of cars) {
        try {
          const name = await car.locator("[data-name]").textContent();
          const price = await car.locator("[data-price]").textContent();
          const variant = await car.locator("[data-variant]").textContent();

          if (name && price) {
            results.push({
              brand: "Tata",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.tatamotors.com",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Tata:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  // Mahindra scraper
  private async scrapeMahindra(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.mahindra.com/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const cars = await page.locator('[class*="car-listing"]').all();

      for (const car of cars) {
        try {
          const name = await car
            .locator("[class*='car-title']")
            .textContent();
          const price = await car
            .locator("[class*='car-price']")
            .textContent();
          const variant = await car
            .locator("[class*='variant']")
            .textContent();

          if (name && price) {
            results.push({
              brand: "Mahindra",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.mahindra.com",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Mahindra:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  // Kia scraper
  private async scrapeKia(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.kia.co.in/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const cars = await page.locator('[data-testid="car-listing"]').all();

      for (const car of cars) {
        try {
          const name = await car.locator("h3").first().textContent();
          const price = await car
            .locator("[data-testid='price']")
            .textContent();
          const variant = await car
            .locator("[data-testid='variant']")
            .textContent();

          if (name && price) {
            results.push({
              brand: "Kia",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.kia.co.in",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Kia:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  // Volkswagen scraper
  private async scrapeVolkswagen(): Promise<ScrapedData[]> {
    const page = await this.createPage();
    const results: ScrapedData[] = [];

    try {
      await page.goto("https://www.volkswagen.co.in/en/cars", {
        waitUntil: "networkidle",
        timeout: 30000,
      });

      const cars = await page.locator('[class*="vehicle-card"]').all();

      for (const car of cars) {
        try {
          const name = await car.locator("h2").first().textContent();
          const price = await car
            .locator("[class*='price']")
            .textContent();
          const variant = await car
            .locator("[class*='trim']")
            .textContent();

          if (name && price) {
            results.push({
              brand: "Volkswagen",
              model: name.trim(),
              variant: variant?.trim() || "Standard",
              price: this.parsePrice(price),
              url: "https://www.volkswagen.co.in",
            });
          }
        } catch (e) {
          console.log("Error extracting car details:", e);
        }
      }
    } catch (error) {
      console.error("Error scraping Volkswagen:", error);
    } finally {
      await page.close();
    }

    return results;
  }

  private parsePrice(priceString: string): number {
    // Remove currency symbols, spaces, and commas
    const cleaned = priceString
      .replace(/[₹$€]/g, "")
      .replace(/,/g, "")
      .replace(/\s/g, "")
      .trim();

    // Handle prices in lakhs/crores
    let price = parseFloat(cleaned);

    if (priceString.toLowerCase().includes("lakh")) {
      price = price * 100000;
    } else if (priceString.toLowerCase().includes("crore")) {
      price = price * 10000000;
    }

    return isNaN(price) ? 0 : price;
  }

  async scrapeAllBrands(): Promise<void> {
    console.log("🚀 Starting car price scraping...");
    await this.initialize();

    try {
      const allResults: ScrapedData[] = [];

      // Run scrapers sequentially with better error handling
      const scrapers = [
        () => this.scrapeMaruti(),
        () => this.scrapeHyundai(),
        () => this.scrapeTata(),
        () => this.scrapeMahindra(),
        () => this.scrapeKia(),
        () => this.scrapeVolkswagen(),
      ];

      for (const scraper of scrapers) {
        try {
          const results = await scraper();
          allResults.push(...results);
        } catch (error) {
          console.error("Scraper error:", error);
        }
      }

      // Save to database
      if (allResults.length > 0) {
        await ScrapedCarPrice.insertMany(
          allResults.map((item) => ({
            ...item,
            scrapedAt: new Date(),
            staticData: false,
          }))
        );

        console.log(`✅ Successfully scraped and stored ${allResults.length} car prices`);
      } else {
        console.warn("⚠️ No data was scraped from any source");
      }
    } catch (error) {
      console.error("❌ Error during scraping:", error);
    } finally {
      await this.cleanup();
    }
  }
}

export default new CarScraper();
