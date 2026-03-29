# DriveX — Car Decision Platform

> Stop browsing. Start deciding.

DriveX is an intelligent car-buying assistant built with **Next.js 15**, **TypeScript**, **Tailwind CSS v4**, and **ShadCN UI**. It helps users browse cars, compare specs side-by-side, get AI-powered recommendations, calculate EMIs, compare loan offers, and find the best insurance plans — all in one place.

## Features

- **Browse & Filter** — Explore new and used cars with live filters (budget, fuel type, body type, city usage)
- **Compare** — Select up to 3 cars and compare specs, pros, and cons side-by-side
- **AI Advisor** — Rule-based recommendation engine that understands natural language queries
- **Loan Calculator** — EMI calculator with 7-lender loan comparison (SBI, HDFC, ICICI, Axis, Kotak, Bajaj, Tata Capital)
- **Insurance Recommender** — 6-insurer comparison (HDFC ERGO, Bajaj Allianz, ICICI Lombard, Go Digit, New India, Tata AIG) with IDV and premium estimates
- **Used Cars** — Dedicated used car listings with trust badges
- **Dealer Contact** — Built-in lead form to connect with dealers

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | ShadCN UI (Radix/Nova) |
| State | React Context API |
| Engines | Custom rule-based AI, Loan & Insurance engines |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
drivex/
├── app/
│   ├── page.tsx              # Home — hero + journey cards
│   ├── cars/page.tsx         # Browse with live filters
│   ├── compare/page.tsx      # Side-by-side comparison
│   ├── ai-advisor/page.tsx   # AI chat advisor
│   ├── used-cars/page.tsx    # Used car listings
│   └── loan-calculator/page.tsx  # 4-tab loan & insurance centre
├── components/
│   ├── navbar/
│   ├── car-card/
│   ├── compare-bar/
│   ├── filters/
│   ├── ai-chat/
│   ├── dealer-form/
│   ├── loan-comparison/
│   └── insurance-recommendation/
├── context/
│   └── CompareContext.tsx    # Global compare state (max 3 cars)
└── lib/
    ├── types.ts              # TypeScript interfaces
    ├── data.ts               # Car catalogue (10 new + 3 used)
    ├── ai-engine.ts          # AI recommendation engine
    ├── loan-engine.ts        # 7-lender loan comparison engine
    └── insurance-engine.ts   # 6-insurer insurance engine
```

## Build

```bash
npm run build
```

Produces 7 static/SSR routes with 0 TypeScript or lint errors.
