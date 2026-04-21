import { Router } from "express";
import scraperRoutes from "./scraper.routes";

const router = Router();

// Register route modules
router.use("/scraped-prices", scraperRoutes);

export default router;
