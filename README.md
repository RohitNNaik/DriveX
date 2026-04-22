# DriveX — Car Decision Platform

> Stop browsing. Start deciding.

DriveX is an intelligent car-buying assistant built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, **ShadCN UI**, and a **BFF (Backend For Frontend)** API layer backed by **MongoDB**. It helps users browse cars, compare specs side-by-side, get AI-powered recommendations, calculate EMIs, compare loan offers, and find the best insurance plans — all in one place.

---

## Features

- **Browse & Filter** — Explore new and used cars with live filters (budget, fuel type, body type, city usage)
- **Compare (Different Cars)** — Select up to 3 cars and compare specs, pros & cons side-by-side; AI-generated winner & insights
- **Compare (Same Model Variants)** — Pick a model (e.g., Hyundai Creta) and compare 2–4 trims side-by-side — winner highlight, price gap, best mileage variant, and per-cell green/winner indicators
- **Agentic AI Car Advisor** — Chat-style advisor powered by **Google Gemini API** with intelligent fallbacks (works without API quota using advanced pattern matching)
- **Loan Calculator** — EMI calculator with 7-lender loan comparison (SBI, HDFC, ICICI, Axis, Kotak, Bajaj, Tata Capital)
- **Insurance Recommender** — 6-insurer comparison (HDFC ERGO, Bajaj Allianz, ICICI Lombard, Go Digit, New India, Tata AIG)
- **Used Cars** — Dedicated used car listings with trust badges
- **Lead / Deal System** — Collect buyer intent as structured leads stored in MongoDB

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | ShadCN UI (Radix/Nova) |
| Database | MongoDB (via Mongoose) |
| AI | Google Gemini 2.0 Flash + intelligent rule-based fallback |
| State | React Context API |

---

## Architecture

```
Frontend (Next.js App Router)
        ↓
BFF Layer  (/bff/*.api.ts)       ← experience APIs, NOT generic CRUD
        ↓
Modules   (/modules/*/)          ← domain services + Mongoose schemas
        ↓
MongoDB  +  Gemini API
```

### Why BFF (Backend For Frontend)?

Instead of generic endpoints like `GET /cars` + `GET /filters`, the BFF builds **experience APIs** optimised for each page:

| BFF Endpoint | Returns |
|---|---|
| `GET /api/bff/explore-page-data` | Featured cars + used cars + stats + filter options in one call |
| `POST /api/bff/compare` | Normalised spec table + winner + AI insights |
| `POST /api/bff/advisor` | Car recommendations + explanation text |

---

## API Reference

### BFF (Experience) APIs

| Method | Path | Description |
|---|---|---|
| GET | `/api/bff/explore-page-data` | Home page data — cars, stats, filter options |
| POST | `/api/bff/compare` | `{ mode?, carIds[] }` or `{ mode: "same-model-variants", variantIds[] }` → comparison table + winner + insights |
| POST | `/api/bff/advisor` | `{ query, city?, budget? }` → Gemini-powered AI car recommendations with fallback to rule-based engine |

### Module APIs

| Method | Path | Description |
|---|---|---|
| GET | `/api/cars` | List new cars — filter by `fuelType`, `bodyType`, `brand`, `minPrice`, `maxPrice` |
| GET | `/api/cars/variants` | `?brand=Hyundai&model=Creta` → list all trims for that model |
| GET | `/api/cars/variant-models` | List all models that have ≥2 variants (for the variant picker) |
| GET | `/api/cars/[id]` | Single car by MongoDB `_id` |
| GET | `/api/used-cars` | List used cars — filter by `city`, `maxKmDriven`, `maxOwners` |
| POST | `/api/leads` | Submit dealer lead `{ name, phone, city, carId?, intent? }` |
| GET | `/api/leads` | List leads (internal) |
| POST | `/api/finance/loan-offers` | `{ carPrice, downPayment, tenureMonths, creditScore? }` → 7 lender offers |
| POST | `/api/finance/insurance` | `{ carPrice, carAge, engineCC, isEV? }` → 6 insurer recommendations |
| POST | `/api/seed` | Seed MongoDB from static catalogue (safe to call multiple times) |

### Example Responses

**`POST /api/bff/compare` — compare different cars**
```json
{
  "mode": "different-cars",
  "carIds": ["<mongoId1>", "<mongoId2>"]
}
```
Response:
```json
{
  "winner": "Hyundai Creta",
  "insights": [
    "Maruti Brezza is the most affordable option",
    "Maruti Brezza offers the best fuel economy at 19.8 kmpl",
    "Hyundai Creta has the most powerful engine at 115 bhp",
    "Hyundai Creta has the highest user rating (4.3/5)"
  ],
  "table": [
    { "label": "Price (₹)", "values": ["₹8,99,000", "₹11,00,000"], "winner": 0 },
    { "label": "Mileage (kmpl)", "values": ["19.8 kmpl", "17 kmpl"], "winner": 0 }
  ]
}
```

**`POST /api/bff/compare` — compare same model variants**
```json
{
  "mode": "same-model-variants",
  "variantIds": ["creta-e-petrol-mt", "creta-sx-diesel-at"]
}
```
Response:
```json
{
  "mode": "same-model-variants",
  "winner": "Creta E Petrol MT",
  "insights": [
    "Creta E Petrol MT is the most affordable variant",
    "Price gap across variants: ₹5,51,000"
  ],
  "table": [
    { "label": "Price (₹)", "values": ["₹10,99,000", "₹16,50,000"], "winner": 0 },
    { "label": "Mileage (kmpl)", "values": ["17.4 kmpl", "21.4 kmpl"], "winner": 1 }
  ]
}
```

**`POST /api/bff/advisor` — Agentic AI Advisor**
```json
{
  "text": "Based on your requirements under ₹15L SUV powered, I recommend: Hyundai Creta, Maruti Brezza, Tata Nexon EV. These cars are great for city driving with good maneuverability and fuel efficiency. Tap Compare to see detailed specs.",
  "suggestions": [ 
    { "id": "hyundai-creta-2024", "name": "Hyundai Creta", "price": 1100000, ... },
    { "id": "maruti-brezza-2024", "name": "Maruti Brezza", "price": 899000, ... },
    { "id": "tata-nexon-ev-2024", "name": "Tata Nexon EV", "price": 1399000, ... }
  ]
}
```

**Query Examples:**
```bash
# Budget-focused
curl -X POST http://localhost:3000/api/bff/advisor \
  -H "Content-Type: application/json" \
  -d '{"query": "best car under 7 lakhs for city driving"}'

# Feature-focused
curl -X POST http://localhost:3000/api/bff/advisor \
  -H "Content-Type: application/json" \
  -d '{"query": "electric car under 15 lakhs"}'

# Family-focused
curl -X POST http://localhost:3000/api/bff/advisor \
  -H "Content-Type: application/json" \
  -d '{"query": "7-seater family car under 20 lakhs"}'
```

---

## Module Structure

```
modules/
├── car/
│   ├── car.schema.ts       Mongoose schema + CarDocumentRaw type
│   └── car.service.ts      getCars(), getCarById(), getFeaturedCars(), seedCars()
├── comparison/
│   ├── comparison.schema.ts
│   └── comparison.service.ts  compareCarIds() + compareVariantIds() → table + winner + insights
├── ai/
│   └── ai.service.ts       processAdvisorQuery() — Gemini API + intelligent rule-based fallback
├── leads/
│   ├── lead.schema.ts
│   └── lead.service.ts     createLead(), getLeads()
├── finance/
│   └── finance.service.ts  computeLoanOffers(), computeInsurance()
└── usedCars/
    └── usedCar.service.ts  getUsedCars()

bff/
├── explore.api.ts          getExplorePageData()
├── compare.api.ts          compareExperience() — mode: different-cars | same-model-variants
└── advisor.api.ts          advisorExperience()

lib/db/
└── mongoose.ts             connectDB() with singleton caching
```

---

## Comparison Modes

The `/compare` page supports two distinct modes toggled via a tab switcher:

### Mode A — Compare Different Cars
- Add up to 3 cars from the Browse page using the **+ Compare** button
- Navigate to `/compare` to see the spec table, winner badge, and pros/cons cards
- Hit **Refresh Analysis** to enhance the result with DB-sourced AI insights
- Winner cells are highlighted green; the overall best-value car earns a 🏆 badge

### Mode B — Compare Variants of the Same Model
- Select this tab on `/compare` — no browsing required
- **Step 1:** Choose a model (e.g., Hyundai Creta, Tata Nexon EV, Maruti Swift, Mahindra Scorpio N)
  - Model list is fetched from `GET /api/cars/variant-models`
- **Step 2:** Pick 2–4 variants using checkboxes
  - Variant list is fetched from `GET /api/cars/variants?brand=Hyundai&model=Creta`
- **Step 3:** Click **Compare N Variants** to trigger `POST /api/bff/compare` with `mode: "same-model-variants"`
- Results include: winner with rationale, price gap insight, per-spec green winner cells, pros/cons per variant
- Falls back to static `CAR_VARIANTS` data if MongoDB is unavailable

### Variant Catalogue (static data in `lib/data.ts`)

| Model | Variants |
|---|---|
| Hyundai Creta | E Petrol MT, S Petrol AT, SX Diesel AT, SX(O) Turbo Petrol DCT |
| Tata Nexon EV | Medium Range 45kWh, Long Range 60kWh |
| Maruti Swift | LXi Petrol MT, VXi Petrol MT, ZXi+ CNG, ZXi+ AT |
| Mahindra Scorpio N | Z2 Petrol MT, Z8 Diesel AT 4WD |

---

## AI Car Advisor — Agentic AI System

The **Agentic AI Advisor** (`/ai-advisor`) is an intelligent chat-based assistant powered by **Google Gemini API 2.0 Flash** with built-in fallbacks for robustness.

### How It Works

**Three-Step Agentic Pipeline:**

1. **Requirement Extraction** — Parses natural language queries to extract:
   - Budget constraints (`"under 15 lakhs"` → ₹15,00,000)
   - Fuel type preferences (Electric, Diesel, Petrol, Hybrid, CNG)
   - Body type (SUV, Sedan, Hatchback, MPV, Coupe)
   - Usage scenarios (City, Highway, Family, Off-road, Budget)
   - Specific features (Sunroof, Safety, Automatic transmission, etc.)

2. **Smart Car Scoring** — Ranks cars from 50+ database entries using weighted scoring:
   - Budget match (15 points)
   - Fuel type preference (12 points)
   - Body type match (10 points)
   - Usage scenario tags (6 points each)
   - Safety & ratings (3-4 points)
   - **Result:** Top 3 cars ranked by relevance

3. **Response Generation** — Two modes:
   - **With Gemini API:** Natural, personalized responses with contextual insights
   - **Without API (fallback):** Intelligent rule-based responses with friendly tone

### Example Queries & Responses

| Query | Recommendations | Insights |
|---|---|---|
| `"Best SUV under 15 lakhs for city"` | Maruti Brezza, Hyundai Creta, Tata Nexon EV | Good fuel efficiency, safety features |
| `"Family car with 7 seats under 20L"` | Toyota Innova Crysta, Mahindra Scorpio N | Excellent seating, safety ratings |
| `"Cheapest electric car"` | Tata Nexon EV, Volkswagen Virtus | Zero-emission, lower operational costs |
| `"Diesel car for highway driving"` | Mahindra Scorpio N, Maruti Swift Diesel | Powerful engines, good torque |

### Features

✅ **Natural Language Understanding** — Understands complex, conversational queries  
✅ **Intelligent Fallbacks** — Works seamlessly without Gemini quota  
✅ **Smart Matching** — Considers 20+ preference criteria  
✅ **Fast Responses** — <500ms without API, 1-2s with Gemini enhancement  
✅ **Production-Ready** — Comprehensive error handling  

### Implementation Details

**Files:**
- `lib/gemini-ai-engine.ts` — Core agentic engine with Gemini integration
- `app/api/bff/advisor/route.ts` — API endpoint
- `components/ai-chat/AIChat.tsx` — Chat UI component

**Key Functions:**
```typescript
// Extract requirements from user query (local pattern matching)
extractRequirementsFromText(query: string) → ExtractedRequirements

// Score and filter cars based on requirements
filterAndScoreCars(requirements) → { car, score }[]

// Enhance response with Gemini (optional)
enhanceResponseWithGemini(topCars, query) → string

// Main entry point
getAIAdvisorResponse(query: string) → { text, suggestions }
```

### Graceful Degradation

| Scenario | Behavior |
|---|---|
| Gemini API available + quota | Enhanced natural responses + recommendations |
| Gemini API unavailable / quota exceeded | Falls back to rule-based intelligent responses (no loss of functionality) |
| Invalid query / no matches | Helpful fallback message suggesting refinement |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/RohitNNaik/DriveX.git
cd DriveX/drivex
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# MongoDB — local or Atlas
MONGODB_URI=mongodb://localhost:27017/drivex

# Gemini API Key (optional — AI advisor gracefully falls back to rule-based engine without it)
GEMINI_API_KEY=AIza...

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5001
```

**Note:** The AI advisor works **with or without the Gemini API key**. When the API quota is exceeded or the key is missing, the system seamlessly falls back to an intelligent rule-based recommendation engine.

### 3. Seed the Database

```bash
curl -X POST http://localhost:3000/api/seed
```

Or just start the app — the BFF auto-seeds on the first request if MongoDB is empty.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Build for Production

```bash
npm run build
npm start
```

---

## Lead Schema

```json
{
  "carId": "abc123",
  "carName": "Hyundai Creta",
  "name": "Rohit",
  "phone": "9999999999",
  "city": "Bangalore",
  "intent": "buy",
  "status": "new"
}
```

Valid `intent` values: `buy` | `test_drive` | `loan` | `insurance` | `general`

---

## Project Structure

```
drivex/
├── app/
│   ├── page.tsx                    Home — hero + journey cards
│   ├── cars/page.tsx               Browse with live filters
│   ├── compare/page.tsx            Side-by-side comparison (two modes: different cars & variants)
│   ├── ai-advisor/page.tsx         AI chat advisor
│   ├── used-cars/page.tsx          Used car listings
│   ├── loan-calculator/page.tsx    4-tab loan & insurance centre
│   └── api/                        Next.js API routes (BFF + modules)
│       ├── bff/explore-page-data/
│       ├── bff/compare/
│       ├── cars/variants/
│       ├── cars/variant-models/
│       ├── bff/advisor/
│       ├── cars/[id]/
│       ├── used-cars/
│       ├── leads/
│       ├── finance/loan-offers/
│       ├── finance/insurance/
│       └── seed/
├── bff/                            BFF experience API functions
├── modules/                        Domain modules (schema + service)
├── components/                     React UI components
├── context/                        React Context (compare state)
└── lib/                            Types, static data, engines, DB connection
```
