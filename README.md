# DriveX — Car Decision Platform

> Stop browsing. Start deciding.

DriveX is an intelligent car-buying assistant built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, **ShadCN UI**, and a **BFF (Backend For Frontend)** API layer backed by **MongoDB**. It helps users browse cars, compare specs side-by-side, get AI-powered recommendations, calculate EMIs, compare loan offers, and find the best insurance plans — all in one place.

---

## Features

- **Browse & Filter** — Explore new and used cars with live filters (budget, fuel type, body type, city usage)
- **Compare** — Select up to 3 cars and compare specs, pros & cons side-by-side; AI-generated winner & insights
- **AI Car Advisor** — Chat-style advisor powered by OpenAI GPT-4o-mini (falls back to rule-based engine)
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
| AI | OpenAI GPT-4o-mini + rule-based fallback |
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
MongoDB  +  OpenAI API
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
| POST | `/api/bff/compare` | `{ carIds[] }` → comparison table + winner + insights |
| POST | `/api/bff/advisor` | `{ query, city?, budget? }` → AI car recommendations |

### Module APIs

| Method | Path | Description |
|---|---|---|
| GET | `/api/cars` | List new cars — filter by `fuelType`, `bodyType`, `brand`, `minPrice`, `maxPrice` |
| GET | `/api/cars/[id]` | Single car by MongoDB `_id` |
| GET | `/api/used-cars` | List used cars — filter by `city`, `maxKmDriven`, `maxOwners` |
| POST | `/api/leads` | Submit dealer lead `{ name, phone, city, carId?, intent? }` |
| GET | `/api/leads` | List leads (internal) |
| POST | `/api/finance/loan-offers` | `{ carPrice, downPayment, tenureMonths, creditScore? }` → 7 lender offers |
| POST | `/api/finance/insurance` | `{ carPrice, carAge, engineCC, isEV? }` → 6 insurer recommendations |
| POST | `/api/seed` | Seed MongoDB from static catalogue (safe to call multiple times) |

### Example Responses

**`POST /api/bff/compare`**
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

**`POST /api/bff/advisor`**
```json
{
  "text": "Here are the best SUVs under ₹10L for city use: Maruti Brezza, Tata Punch",
  "suggestions": [ { "name": "Maruti Brezza", ... }, { "name": "Tata Punch", ... } ],
  "source": "rule-based"
}
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
│   └── comparison.service.ts  compareCarIds() → table + winner + insights
├── ai/
│   └── ai.service.ts       processAdvisorQuery() — OpenAI + rule-based fallback
├── leads/
│   ├── lead.schema.ts
│   └── lead.service.ts     createLead(), getLeads()
├── finance/
│   └── finance.service.ts  computeLoanOffers(), computeInsurance()
└── usedCars/
    └── usedCar.service.ts  getUsedCars()

bff/
├── explore.api.ts          getExplorePageData()
├── compare.api.ts          compareExperience()
└── advisor.api.ts          advisorExperience()

lib/db/
└── mongoose.ts             connectDB() with singleton caching
```

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

# OpenAI (optional — AI advisor falls back to rule-based engine without it)
OPENAI_API_KEY=sk-...

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

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
│   ├── compare/page.tsx            Side-by-side comparison
│   ├── ai-advisor/page.tsx         AI chat advisor
│   ├── used-cars/page.tsx          Used car listings
│   ├── loan-calculator/page.tsx    4-tab loan & insurance centre
│   └── api/                        Next.js API routes (BFF + modules)
│       ├── bff/explore-page-data/
│       ├── bff/compare/
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
