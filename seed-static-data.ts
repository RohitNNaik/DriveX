import dotenv from "dotenv";
import { connectDB } from "./src/config/db";
import ScrapedCarPrice from "./src/models/ScrapedCarPrice";

dotenv.config();

const STATIC_DATA = [
  // Maruti Suzuki
  {
    brand: "Maruti Suzuki",
    model: "Alto",
    variant: "Standard",
    price: 355000,
    currency: "INR",
    url: "https://www.maruti.co.in",
  },
  {
    brand: "Maruti Suzuki",
    model: "Swift",
    variant: "Standard",
    price: 589000,
    currency: "INR",
    url: "https://www.maruti.co.in",
  },
  {
    brand: "Maruti Suzuki",
    model: "Celerio",
    variant: "Standard",
    price: 495000,
    currency: "INR",
    url: "https://www.maruti.co.in",
  },
  // Hyundai
  {
    brand: "Hyundai",
    model: "i10",
    variant: "Standard",
    price: 545000,
    currency: "INR",
    url: "https://www.hyundaiindia.com",
  },
  {
    brand: "Hyundai",
    model: "i20",
    variant: "Standard",
    price: 695000,
    currency: "INR",
    url: "https://www.hyundaiindia.com",
  },
  // Tata
  {
    brand: "Tata",
    model: "Tiago",
    variant: "Standard",
    price: 510000,
    currency: "INR",
    url: "https://www.tatamotors.com",
  },
  {
    brand: "Tata",
    model: "Nexon",
    variant: "Standard",
    price: 795000,
    currency: "INR",
    url: "https://www.tatamotors.com",
  },
  // Mahindra
  {
    brand: "Mahindra",
    model: "XUV300",
    variant: "Standard",
    price: 855000,
    currency: "INR",
    url: "https://www.mahindra.com",
  },
  // Kia
  {
    brand: "Kia",
    model: "Seltos",
    variant: "Standard",
    price: 980000,
    currency: "INR",
    url: "https://www.kia.co.in",
  },
  // Volkswagen
  {
    brand: "Volkswagen",
    model: "Polo",
    variant: "Standard",
    price: 565000,
    currency: "INR",
    url: "https://www.volkswagen.co.in",
  },
];

async function seedStaticData() {
  try {
    await connectDB();
    console.log("📦 Seeding static car price data...");

    // Clear existing static data
    await ScrapedCarPrice.deleteMany({ staticData: true });

    // Insert new static data
    const staticDataWithMetadata = STATIC_DATA.map((item) => ({
      ...item,
      scrapedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      staticData: true,
    }));

    const result = await ScrapedCarPrice.insertMany(staticDataWithMetadata);
    console.log(`✅ Successfully seeded ${result.length} static car price records`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedStaticData();
