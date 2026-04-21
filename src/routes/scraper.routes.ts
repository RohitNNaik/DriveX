import { Router, Request, Response } from "express";
import ScrapedCarPrice from "../models/ScrapedCarPrice";

const router = Router();

// Constants for stale data threshold
const STALE_THRESHOLD_HOURS = 6;

interface PriceData {
  brand: string;
  model: string;
  variant: string;
  price: number;
  currency: string;
  url: string;
  scrapedAt: Date;
  isStale: boolean;
  source: "live" | "static";
}

/**
 * Check if data is stale based on scraping timestamp
 */
function isDataStale(scrapedAt: Date): boolean {
  const now = new Date();
  const diffInHours =
    (now.getTime() - scrapedAt.getTime()) / (1000 * 60 * 60);
  return diffInHours > STALE_THRESHOLD_HOURS;
}

/**
 * GET /scraped-prices - Get all scraped car prices with fallback to static data
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const brand = req.query.brand as string | undefined;
    const model = req.query.model as string | undefined;

    // Build query
    const query: any = { staticData: false };
    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (model) query.model = { $regex: model, $options: "i" };

    // Get latest prices for each brand-model-variant combination
    const prices = await ScrapedCarPrice.aggregate([
      { $match: query },
      { $sort: { scrapedAt: -1 } },
      {
        $group: {
          _id: {
            brand: "$brand",
            model: "$model",
            variant: "$variant",
          },
          price: { $first: "$price" },
          currency: { $first: "$currency" },
          url: { $first: "$url" },
          scrapedAt: { $first: "$scrapedAt" },
        },
      },
    ]);

    // Format response and check staleness
    const formattedPrices: PriceData[] = prices.map((item) => ({
      brand: item._id.brand,
      model: item._id.model,
      variant: item._id.variant,
      price: item.price,
      currency: item.currency,
      url: item.url,
      scrapedAt: item.scrapedAt,
      isStale: isDataStale(item.scrapedAt),
      source: "live",
    }));

    // If no live data or all stale, fallback to static data
    if (formattedPrices.length === 0 || formattedPrices.every((p) => p.isStale)) {
      console.log("⚠️ No live data available, falling back to static data...");
      
      // Build static query (remove staticData constraint from original query)
      const staticQuery: any = { ...query };
      delete staticQuery.staticData;
      staticQuery.staticData = true;

      const staticPrices = await ScrapedCarPrice.aggregate([
        { $match: staticQuery },
        { $sort: { scrapedAt: -1 } },
        {
          $group: {
            _id: {
              brand: "$brand",
              model: "$model",
              variant: "$variant",
            },
            price: { $first: "$price" },
            currency: { $first: "$currency" },
            url: { $first: "$url" },
            scrapedAt: { $first: "$scrapedAt" },
          },
        },
      ]);

      const staticFormattedPrices: PriceData[] = staticPrices.map((item) => ({
        brand: item._id.brand,
        model: item._id.model,
        variant: item._id.variant,
        price: item.price,
        currency: item.currency,
        url: item.url,
        scrapedAt: item.scrapedAt,
        isStale: true,
        source: "static",
      }));

      return res.json({
        success: true,
        count: staticFormattedPrices.length,
        data: staticFormattedPrices,
        warning: "Using static/cached data due to stale live data",
      });
    }

    res.json({
      success: true,
      count: formattedPrices.length,
      data: formattedPrices,
    });
  } catch (error) {
    console.error("Error fetching scraped prices:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch scraped prices",
    });
  }
});

/**
 * GET /scraped-prices/:brand - Get prices for a specific brand
 */
router.get("/:brand", async (req: Request, res: Response) => {
  try {
    const { brand } = req.params;

    const prices = await ScrapedCarPrice.aggregate([
      {
        $match: {
          brand: { $regex: brand, $options: "i" },
          staticData: false,
        },
      },
      { $sort: { scrapedAt: -1 } },
      {
        $group: {
          _id: {
            model: "$model",
            variant: "$variant",
          },
          price: { $first: "$price" },
          currency: { $first: "$currency" },
          url: { $first: "$url" },
          scrapedAt: { $first: "$scrapedAt" },
        },
      },
    ]);

    const formattedPrices: PriceData[] = prices.map((item) => ({
      brand: brand.toUpperCase(),
      model: item._id.model,
      variant: item._id.variant,
      price: item.price,
      currency: item.currency,
      url: item.url,
      scrapedAt: item.scrapedAt,
      isStale: isDataStale(item.scrapedAt),
      source: "live",
    }));

    // If no live data or all stale, fallback to static data
    if (formattedPrices.length === 0 || formattedPrices.every((p) => p.isStale)) {
      const staticPrices = await ScrapedCarPrice.aggregate([
        {
          $match: {
            brand: { $regex: brand, $options: "i" },
            staticData: true,
          },
        },
        { $sort: { scrapedAt: -1 } },
        {
          $group: {
            _id: {
              model: "$model",
              variant: "$variant",
            },
            price: { $first: "$price" },
            currency: { $first: "$currency" },
            url: { $first: "$url" },
            scrapedAt: { $first: "$scrapedAt" },
          },
        },
      ]);

      const staticFormattedPrices: PriceData[] = staticPrices.map((item) => ({
        brand: brand.toUpperCase(),
        model: item._id.model,
        variant: item._id.variant,
        price: item.price,
        currency: item.currency,
        url: item.url,
        scrapedAt: item.scrapedAt,
        isStale: true,
        source: "static",
      }));

      return res.json({
        success: true,
        brand,
        count: staticFormattedPrices.length,
        data: staticFormattedPrices,
        warning: staticFormattedPrices.length > 0 ? "Using static/cached data" : undefined,
      });
    }

    res.json({
      success: true,
      brand,
      count: formattedPrices.length,
      data: formattedPrices,
    });
  } catch (error) {
    console.error("Error fetching brand prices:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch brand prices",
    });
  }
});

/**
 * GET /scraped-prices/status/health - Get scraper status and last update time
 */
router.get("/status/health", async (req: Request, res: Response) => {
  try {
    // Try to get live data first
    let lastScraped = await ScrapedCarPrice.findOne(
      { staticData: false },
      {},
      { sort: { scrapedAt: -1 } }
    );

    if (!lastScraped) {
      // Fall back to checking static data
      lastScraped = await ScrapedCarPrice.findOne(
        { staticData: true },
        {},
        { sort: { scrapedAt: -1 } }
      );
    }

    if (!lastScraped) {
      return res.json({
        success: true,
        status: "no_data",
        message: "No scraped data available yet",
      });
    }

    const isStale = isDataStale(lastScraped.scrapedAt);
    const hoursAgo = Math.round(
      (new Date().getTime() - lastScraped.scrapedAt.getTime()) / (1000 * 60 * 60)
    );

    res.json({
      success: true,
      status: isStale ? "stale" : "fresh",
      lastScrapedAt: lastScraped.scrapedAt,
      hoursAgo,
      staleThresholdHours: STALE_THRESHOLD_HOURS,
      dataType: lastScraped.staticData ? "static" : "live",
    });
  } catch (error) {
    console.error("Error fetching scraper status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch scraper status",
    });
  }
});

export default router;
