import dotenv from "dotenv";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import scraperScheduler from "./src/modules/scraperScheduler";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    
    // Start the scraper scheduler
    scraperScheduler.start();
  });
});
