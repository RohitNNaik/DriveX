# Car Price Web Scraper

A robust Playwright-based web scraper that collects car prices from official brand websites and serves the data via REST API with intelligent fallback to static data.

## Features

- **Multi-Brand Scraping**: Scrapes 6 official brand websites (Maruti, Hyundai, Tata, Mahindra, Kia, Volkswagen)
- **Automated Scheduling**: Runs every 6 hours via node-cron
- **MongoDB Storage**: Persists scraped data with timestamps
- **Smart Fallback**: Serves static/cached data if live data becomes stale (>6 hours old)
- **RESTful API**: Easy-to-use endpoints for retrieving car prices
- **Type-Safe**: Full TypeScript support

## Setup

### 1. Install Dependencies
```bash
npm install
npm install playwright node-cron
```

### 2. Seed Static Data (Optional)
```bash
npm run seed
```

This creates fallback static price data for testing and ensures data availability if scraping fails.

### 3. Start the Server
```bash
npm run dev
```

The scraper will automatically:
- Run on server startup
- Run every 6 hours via cron job
- Save data to MongoDB
- Clean up old records (TTL: 7 days)

## API Endpoints

### Get All Prices
```
GET /api/scraped-prices
```

**Query Parameters:**
- `brand` (optional): Filter by brand name (case-insensitive)
- `model` (optional): Filter by model name (case-insensitive)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "brand": "Maruti Suzuki",
      "model": "Swift",
      "variant": "Standard",
      "price": 589000,
      "currency": "INR",
      "url": "https://www.maruti.co.in",
      "scrapedAt": "2024-01-15T10:30:00.000Z",
      "isStale": false,
      "source": "live"
    }
  ]
}
```

### Get Prices by Brand
```
GET /api/scraped-prices/:brand
```

**Example:**
```
GET /api/scraped-prices/maruti
```

### Get Scraper Status
```
GET /api/scraped-prices/status/health
```

**Response:**
```json
{
  "success": true,
  "status": "fresh",
  "lastScrapedAt": "2024-01-15T10:30:00.000Z",
  "hoursAgo": 2,
  "staleThresholdHours": 6
}
```

## Data Model

### ScrapedCarPrice

```typescript
{
  brand: string;           // e.g., "Maruti Suzuki"
  model: string;           // e.g., "Swift"
  variant: string;         // e.g., "Standard", "VXi", "ZXi"
  price: number;           // Price in base currency (usually INR)
  currency: string;        // e.g., "INR"
  url: string;             // Source website URL
  scrapedAt: Date;         // When the price was scraped
  staticData?: boolean;    // Flag for fallback static data
  createdAt: Date;         // Record creation timestamp
  updatedAt: Date;         // Record update timestamp
  expiresAt?: Date;        // TTL: Auto-delete after 7 days
}
```

## How It Works

### Scraping Flow
1. **Initialization**: Playwright launches a browser instance
2. **Navigation**: Visits each brand's official website
3. **Extraction**: Parses HTML/CSS selectors to find prices, models, variants
4. **Parsing**: Converts price strings to numbers (handles "Lakh", "Crore" notation)
5. **Storage**: Saves data to MongoDB with timestamp
6. **Cleanup**: Browser closes, freeing resources

### Scheduling
- **Cron Pattern**: `0 */6 * * *` (every 6 hours at :00 minutes)
- **Startup**: Scraper runs immediately when server starts
- **Automatic**: Subsequent runs at 6-hour intervals

### Fallback Logic
1. Check for fresh live data (scrape timestamp < 6 hours)
2. If stale or missing, fall back to static data
3. Include `source: "live"` or `source: "static"` in response
4. Add `warning` message if using static data

## Configuration

### Stale Threshold
Change the stale data threshold in `src/routes/scraper.routes.ts`:
```typescript
const STALE_THRESHOLD_HOURS = 6;
```

### Cron Schedule
Modify the cron pattern in `src/modules/scraperScheduler.ts`:
```typescript
// 0 */6 * * * = Every 6 hours
// 0 0 * * * = Daily at midnight
cron.schedule("0 */6 * * *", async () => { ... });
```

### TTL Index
Change the data retention period in `src/models/ScrapedCarPrice.ts`:
```typescript
expiresAt: {
  type: Date,
  default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  index: { expireAfterSeconds: 0 },
}
```

## Website Selectors

The scraper uses CSS/data selectors tailored to each brand's website structure. If websites change their HTML structure, you may need to update the selectors in `src/modules/carScraper.ts`:

- **Maruti**: `[data-testid="car-card"]`
- **Hyundai**: `[class*="car-item"]`
- **Tata**: `[data-car]`
- **Mahindra**: `[class*="car-listing"]`
- **Kia**: `[data-testid="car-listing"]`
- **Volkswagen**: `[class*="vehicle-card"]`

### Debugging Selectors
To debug and update selectors:
1. Open the brand website in browser
2. Inspect the car listing elements
3. Find common CSS selectors or data attributes
4. Update the corresponding method in `carScraper.ts`
5. Test with `npm run dev`

## Error Handling

The scraper includes robust error handling:
- **Network timeouts**: 30-second timeout per website
- **Parse errors**: Gracefully skips malformed prices
- **Browser crashes**: Automatic cleanup and restart
- **Database errors**: Logs and continues with other brands
- **Cron failures**: Errors logged but don't prevent next scheduled run

## Monitoring

Check scraper health:
```bash
curl http://localhost:5000/api/scraped-prices/status/health
```

View recent prices:
```bash
curl "http://localhost:5000/api/scraped-prices?brand=maruti"
```

## Deployment

### Vercel Cron (Alternative to Node Cron)
If deploying to Vercel, replace node-cron with Vercel's cron functions:

1. Create `/api/cron/scrape-prices.js`:
```javascript
export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const carScraper = require("../modules/carScraper");
  await carScraper.scrapeAllBrands();
  res.status(200).json({ success: true });
}
```

2. Update `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/scrape-prices",
    "schedule": "0 */6 * * *"
  }]
}
```

3. Set `CRON_SECRET` environment variable in Vercel dashboard

## Troubleshooting

### No data scraped
- Check website selectors (they may have changed)
- Verify browser is launching: `console.log` statements in carScraper
- Check MongoDB connection

### Stale data being returned
- Normal behavior if scraper failed or hasn't run yet
- Check `/status/health` endpoint
- Verify cron job is running in logs

### Memory issues with Playwright
- Reduce timeout or add per-scraper browser instance management
- Monitor server resources during scraping

## License
ISC
