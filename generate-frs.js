const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, ExternalHyperlink,
} = require("docx");
const fs = require("fs");

// ── Helpers ────────────────────────────────────────────────────────────────
const CONTENT_WIDTH = 9360; // US Letter 8.5" - 2x1" margins = 9360 DXA
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });
}
function heading3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] });
}
function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })],
  });
}
function bold(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, bold: true })] });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [new TextRun(text)],
  });
}
function spacer() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}
function pageBreak() {
  return new Paragraph({ pageBreakBefore: true, children: [] });
}

// ── Table builder ──────────────────────────────────────────────────────────
function makeTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const headerFill = "1F4E79";
  const altFill = "EBF3FB";

  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        borders,
        width: { size: colWidths[i], type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: headerFill, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [new TextRun({ text: h, bold: true, color: "FFFFFF" })],
        })],
      })
    ),
  });

  const dataRows = rows.map((row, rIdx) =>
    new TableRow({
      children: row.map((cell, i) =>
        new TableCell({
          borders,
          width: { size: colWidths[i], type: WidthType.DXA },
          margins: cellMargins,
          shading: { fill: rIdx % 2 === 1 ? altFill : "FFFFFF", type: ShadingType.CLEAR },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [new TextRun({ text: String(cell) })] })],
        })
      ),
    })
  );

  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [headerRow, ...dataRows],
  });
}

// ── Document ───────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "000000" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
              children: [
                new TextRun({ text: "DriveX \u2014 Functional Requirements Specification", bold: true, color: "1F4E79", font: "Arial", size: 20 }),
                new TextRun({ text: "\tv1.0  |  2026-04-16", font: "Arial", size: 18, color: "666666" }),
              ],
              tabStops: [{ type: "right", position: 9360 }],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", font: "Arial", size: 18, color: "666666" }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "666666" }),
                new TextRun({ text: " of ", font: "Arial", size: 18, color: "666666" }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "666666" }),
              ],
            }),
          ],
        }),
      },
      children: [
        // ── Cover ──────────────────────────────────────────────────────────
        new Paragraph({
          spacing: { before: 2880, after: 240 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "DriveX", bold: true, size: 72, font: "Arial", color: "1F4E79" })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Car Decision Platform", size: 36, font: "Arial", color: "2E75B6" })],
        }),
        new Paragraph({
          spacing: { after: 480 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Functional Requirements Specification", size: 28, font: "Arial", color: "444444" })],
        }),
        makeTable(
          ["Field", "Value"],
          [
            ["Version", "1.0"],
            ["Date", "2026-04-16"],
            ["Status", "Draft"],
            ["Prepared by", "DriveX Engineering Team"],
          ],
          [2880, 6480]
        ),
        pageBreak(),

        // ── 1. Overview ────────────────────────────────────────────────────
        heading1("1. Overview"),
        body("DriveX is a web-based car-buying assistant that helps users browse, compare, finance, and insure cars. It is built on Next.js 16 (App Router), TypeScript, Tailwind CSS v4, MongoDB, and an optional OpenAI integration."),
        body("The platform follows a BFF (Backend For Frontend) architecture where each page fetches a single experience API that returns all required data in one call, rather than multiple generic REST endpoints."),
        spacer(),

        // ── 2. User Roles ──────────────────────────────────────────────────
        heading1("2. User Roles"),
        makeTable(
          ["Role", "Description"],
          [
            ["Buyer", "Public end-user browsing, comparing, and applying for deals"],
            ["Admin / Internal", "Reads leads via GET /api/leads (no authentication enforced in v1.0)"],
          ],
          [2000, 7360]
        ),
        spacer(),

        // ── 3. Pages & Modules ─────────────────────────────────────────────
        heading1("3. Pages & Modules"),

        // 3.1
        heading2("3.1  Home Page  ( / )"),
        bullet("Display hero section with platform tagline (\"Stop browsing. Start deciding.\")"),
        bullet("Show journey/feature cards linking to: Browse, Compare, AI Advisor, Used Cars, Loan Calculator"),
        bullet("Fetch aggregated page data from GET /api/bff/explore-page-data in a single request (featured cars + used cars + platform stats + filter options)"),
        spacer(),

        // 3.2
        heading2("3.2  Browse New Cars  ( /cars )"),
        body("FR-CARS-01:", { bold: true }),
        body("Display all new cars from MongoDB (fallback: static CARS catalogue in lib/data.ts)."),
        body("FR-CARS-02:  Live filter panel", { bold: true }),
        makeTable(
          ["Filter", "Type", "Values"],
          [
            ["Budget", "Range slider", "Min / max price in INR"],
            ["Fuel Type", "Multi-select", "Petrol, Diesel, Electric, Hybrid, CNG"],
            ["Body Type", "Multi-select", "SUV, Sedan, Hatchback, MPV, Coupe"],
            ["Usage", "Multi-select", "City, Highway, Family, Off-road, Budget"],
          ],
          [2000, 2500, 4860]
        ),
        spacer(),
        body("FR-CARS-03:  Each car card shows: name, image, price, fuel type, mileage, rating, seating, and a + Compare button."),
        body("FR-CARS-04:  Clicking + Compare adds the car to the global compare state (React Context). Maximum 3 cars allowed simultaneously."),
        body("FR-CARS-05:  A persistent CompareBar at the bottom of the page appears when 1+ car is selected, showing selected cars and a Go to Compare button."),
        spacer(),

        // 3.3
        heading2("3.3  Compare Page  ( /compare )"),
        body("Two modes are selectable via a tab switcher on this page."),
        heading3("Mode A \u2014 Compare Different Cars"),
        body("FR-CMP-01:  Display cars added via the Browse page (from CompareContext), up to 3 cars."),
        body("FR-CMP-02:  Render a side-by-side spec table:"),
        makeTable(
          ["Spec Row", "Unit"],
          [
            ["Price", "\u20B9 INR"],
            ["Mileage", "kmpl"],
            ["Engine", "cc"],
            ["Power", "bhp"],
            ["Torque", "Nm"],
            ["Airbags", "count"],
            ["Seating", "count"],
            ["Fuel Type", "\u2014"],
            ["Transmission", "\u2014"],
            ["Rating", "out of 5"],
          ],
          [4680, 4680]
        ),
        spacer(),
        body("FR-CMP-03:  Winning cell (best value) in each row is highlighted green."),
        body("FR-CMP-04:  Overall winner is determined and displayed with a trophy badge."),
        body("FR-CMP-05:  AI-generated insights list is shown (e.g., \"Creta has the most powerful engine\")."),
        body("FR-CMP-06:  Pros & Cons cards shown per car."),
        body("FR-CMP-07:  \"Refresh Analysis\" button re-calls POST /api/bff/compare to fetch updated insights from the backend."),
        spacer(),
        heading3("Mode B \u2014 Compare Variants of the Same Model"),
        body("FR-VAR-01:  Step 1 \u2014 Model picker dropdown populated from GET /api/cars/variant-models (only models with \u22652 variants shown)."),
        body("FR-VAR-02:  Step 2 \u2014 Variant checkbox list fetched from GET /api/cars/variants?brand=&model=. User selects 2\u20134 variants."),
        body("FR-VAR-03:  Step 3 \u2014 \"Compare N Variants\" button triggers POST /api/bff/compare with { mode: \"same-model-variants\", variantIds: [...] }."),
        body("FR-VAR-04:  Results display same spec table as Mode A, plus:"),
        bullet("Winner with rationale"),
        bullet("Price gap across variants (e.g., \"Price gap: \u20B95,51,000\")"),
        bullet("Best mileage variant callout"),
        bullet("Per-cell green winner indicators"),
        bullet("Pros/Cons per variant"),
        body("FR-VAR-05:  Falls back to static CAR_VARIANTS data if MongoDB is unavailable."),
        spacer(),
        body("Supported variant catalogue:"),
        makeTable(
          ["Model", "Variants"],
          [
            ["Hyundai Creta", "E Petrol MT, S Petrol AT, SX Diesel AT, SX(O) Turbo Petrol DCT"],
            ["Tata Nexon EV", "Medium Range 45kWh, Long Range 60kWh"],
            ["Maruti Swift", "LXi Petrol MT, VXi Petrol MT, ZXi+ CNG, ZXi+ AT"],
            ["Mahindra Scorpio N", "Z2 Petrol MT, Z8 Diesel AT 4WD"],
          ],
          [3000, 6360]
        ),
        spacer(),

        // 3.4
        heading2("3.4  AI Car Advisor  ( /ai-advisor )"),
        body("FR-AI-01:  Chat-style UI where the user submits a natural-language query (e.g., \"Best SUV under \u20B910L for city use\")."),
        body("FR-AI-02:  Optional inputs: city, budget."),
        body("FR-AI-03:  Request sent to POST /api/bff/advisor."),
        body("FR-AI-04:  AI engine (primary): OpenAI GPT-4o-mini \u2014 generates recommendations as structured JSON."),
        body("FR-AI-05:  Fallback (if no API key or OpenAI error): rule-based engine in lib/ai-engine.ts filters cars by budget and usage tags."),
        body("FR-AI-06:  Response displays:"),
        bullet("Free-text explanation paragraph"),
        bullet("List of recommended car cards (name, price, mileage, pros)"),
        bullet("Source indicator: \"openai\" or \"rule-based\""),
        spacer(),

        // 3.5
        heading2("3.5  Used Cars  ( /used-cars )"),
        body("FR-USED-01:  Fetch used car listings from GET /api/used-cars."),
        body("FR-USED-02:  Filters: city, max km driven, max number of previous owners."),
        body("FR-USED-03:  Each card shows: name, year, price, km driven, owner count, fuel type, rating, and trust badges (e.g., \"Single Owner\", \"Low KM\")."),
        spacer(),

        // 3.6
        heading2("3.6  Loan Calculator & Insurance Centre  ( /loan-calculator )"),
        body("This page is organised into four tabs."),
        heading3("Tab 1 \u2014 EMI Calculator"),
        body("FR-LOAN-01:  Inputs: car price (\u20B9), down payment (\u20B9), tenure (months), credit score (Excellent / Good / Fair)."),
        body("FR-LOAN-02:  Derived loan principal = car price \u2212 down payment."),
        body("FR-LOAN-03:  Real-time EMI preview calculated client-side before form submission."),
        spacer(),
        heading3("Tab 2 \u2014 Loan Offers Comparison"),
        body("FR-LOAN-04:  Submit inputs to POST /api/finance/loan-offers. Returns ranked offers from 7 lenders."),
        body("FR-LOAN-05:  Each offer card shows:"),
        makeTable(
          ["Field", "Description"],
          [
            ["Lender name & type", "Bank / NBFC"],
            ["Applied interest rate", "% p.a. (based on credit score)"],
            ["Monthly EMI", "\u20B9"],
            ["Total interest", "\u20B9"],
            ["Total payable", "\u20B9"],
            ["Processing fee", "\u20B9"],
            ["Effective cost", "Total payable + processing fee"],
            ["Pre-approval time", "\u2014"],
            ["Features", "Bullet list"],
            ["Best for", "Target customer segment"],
            ["Badge", "\"Best Deal\" or \"Runner Up\""],
          ],
          [3500, 5860]
        ),
        spacer(),
        body("FR-LOAN-06:  Lender eligibility rules:"),
        bullet("Loan amount must fall within the lender\u2019s min/max range"),
        bullet("Tenure must not exceed the lender\u2019s maxTenureMonths"),
        bullet("Rate applied = minRate + (maxRate \u2212 minRate) \u00D7 creditMultiplier \u00D7 0.6"),
        spacer(),
        body("FR-LOAN-07:  Lenders supported:"),
        makeTable(
          ["Lender", "Type", "Rate Range", "Max LTV", "Max Tenure"],
          [
            ["SBI Car Loan", "Bank", "8.75\u201310.75%", "85%", "84 months"],
            ["HDFC Bank", "Bank", "8.90\u201311.50%", "100%", "84 months"],
            ["ICICI Bank", "Bank", "9.00\u201312.00%", "100%", "84 months"],
            ["Axis Bank", "Bank", "9.25\u201313.00%", "95%", "84 months"],
            ["Kotak Mahindra", "Bank", "8.99\u201314.00%", "100%", "60 months"],
            ["Bajaj Finserv", "NBFC", "9.50\u201315.00%", "95%", "84 months"],
            ["Tata Capital", "NBFC", "9.25\u201314.00%", "90%", "72 months"],
          ],
          [2200, 1400, 1800, 1500, 2460]
        ),
        spacer(),
        heading3("Tab 3 \u2014 Insurance Recommendations"),
        body("FR-INS-01:  Inputs: car price (\u20B9), car age (years), engine CC, EV flag."),
        body("FR-INS-02:  Submit to POST /api/finance/insurance. Returns ranked recommendations from 6 insurers."),
        body("FR-INS-03:  IDV = carPrice \u00D7 (1 \u2212 depreciation[carAge]) \u00D7 (idvCoverage / 100)."),
        body("FR-INS-04:  Depreciation table:"),
        makeTable(
          ["Car Age (years)", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9+"],
          [
            ["Depreciation %", "0%", "5%", "10%", "15%", "20%", "25%", "35%", "40%", "45%", "50%"],
          ],
          [1800, 720, 720, 720, 720, 720, 720, 720, 720, 720, 720]
        ),
        spacer(),
        body("FR-INS-05:  Statutory third-party (TP) premium by engine size:"),
        makeTable(
          ["Engine CC", "TP Premium"],
          [
            ["< 1000 cc", "\u20B92,094"],
            ["1000\u20131500 cc", "\u20B93,416"],
            ["> 1500 cc", "\u20B97,897"],
            ["EV (any)", "\u20B93,416 (flat)"],
          ],
          [4680, 4680]
        ),
        spacer(),
        body("FR-INS-06:  Each recommendation card shows: insurer, plan type, estimated IDV, estimated premium, claim settlement ratio, network garages, key features, exclusions, add-ons, badge (\"Top Pick\" / \"2nd Choice\"), and contextual tag."),
        spacer(),
        body("FR-INS-07:  Insurers supported:"),
        makeTable(
          ["Insurer", "Plan Type", "CSR", "Network Garages", "IDV Coverage"],
          [
            ["HDFC ERGO", "Zero Depreciation", "98.0%", "6,800", "95%"],
            ["Bajaj Allianz", "Comprehensive", "97.0%", "4,000", "90%"],
            ["ICICI Lombard", "Comprehensive", "96.4%", "5,600", "92%"],
            ["Go Digit", "Comprehensive", "95.8%", "1,400", "88%"],
            ["New India Assurance", "Third-Party", "93.5%", "3,000", "0% (TP only)"],
            ["Tata AIG", "Bundled (1+3 yr)", "97.5%", "5,500", "100%"],
          ],
          [2000, 2000, 1200, 2000, 2160]
        ),
        spacer(),
        heading3("Tab 4 \u2014 Dealer / Lead Form"),
        body("FR-LEAD-01:  User fills: name, phone, city, car of interest (optional), intent."),
        body("FR-LEAD-02:  Valid intent values: buy | test_drive | loan | insurance | general."),
        body("FR-LEAD-03:  Submits to POST /api/leads. Lead is stored in MongoDB with status: \"new\"."),
        spacer(),

        // ── 4. Data Model ──────────────────────────────────────────────────
        pageBreak(),
        heading1("4. Data Model"),
        heading2("4.1  Car"),
        makeTable(
          ["Field", "Type", "Notes"],
          [
            ["id", "string", "Slug e.g. maruti-brezza-2024"],
            ["name", "string", ""],
            ["brand", "string", ""],
            ["model", "string", ""],
            ["variant", "string?", "e.g. SX Diesel AT"],
            ["year", "number", ""],
            ["price", "number", "INR"],
            ["image", "string", "Asset path"],
            ["fuelType", "enum", "Petrol | Diesel | Electric | Hybrid | CNG"],
            ["transmission", "enum", "Manual | Automatic"],
            ["bodyType", "enum", "SUV | Sedan | Hatchback | MPV | Coupe"],
            ["mileage", "number", "kmpl (0 for EV)"],
            ["seating", "number", ""],
            ["engineCC", "number", "0 for EV"],
            ["power", "number", "bhp"],
            ["torque", "number", "Nm"],
            ["airbags", "number", ""],
            ["rating", "number", "Out of 5"],
            ["pros", "string[]", ""],
            ["cons", "string[]", ""],
            ["tags", "UsageTag[]", "City | Highway | Family | Off-road | Budget"],
            ["isUsed", "boolean?", "Used cars only"],
            ["kmDriven", "number?", "Used cars only"],
            ["owners", "number?", "Used cars only"],
          ],
          [2200, 2000, 5160]
        ),
        spacer(),
        heading2("4.2  Lead"),
        makeTable(
          ["Field", "Type"],
          [
            ["carId", "string?"],
            ["carName", "string?"],
            ["name", "string"],
            ["phone", "string"],
            ["city", "string"],
            ["intent", "buy | test_drive | loan | insurance | general"],
            ["status", "\"new\" (default)"],
          ],
          [3000, 6360]
        ),
        spacer(),

        // ── 5. API Reference ───────────────────────────────────────────────
        heading1("5. API Reference"),
        heading2("5.1  BFF (Experience) APIs"),
        makeTable(
          ["Method", "Path", "Purpose"],
          [
            ["GET", "/api/bff/explore-page-data", "Home page \u2014 featured cars, used cars, stats, filter options"],
            ["POST", "/api/bff/compare", "Spec comparison table + winner + insights (both modes)"],
            ["POST", "/api/bff/advisor", "AI or rule-based car recommendation response"],
          ],
          [1200, 3500, 4660]
        ),
        spacer(),
        heading2("5.2  Module APIs"),
        makeTable(
          ["Method", "Path", "Purpose"],
          [
            ["GET", "/api/cars", "New cars with filters (fuelType, bodyType, brand, minPrice, maxPrice)"],
            ["GET", "/api/cars/variants", "?brand=&model= \u2192 variant list for that model"],
            ["GET", "/api/cars/variant-models", "Models that have \u22652 variants (for variant picker)"],
            ["GET", "/api/cars/[id]", "Single car by MongoDB _id"],
            ["GET", "/api/used-cars", "Used cars with filters (city, maxKmDriven, maxOwners)"],
            ["POST", "/api/leads", "Create a new buyer lead"],
            ["GET", "/api/leads", "List all leads (internal use)"],
            ["POST", "/api/finance/loan-offers", "Ranked loan offers from 7 lenders"],
            ["POST", "/api/finance/insurance", "Ranked insurance recommendations from 6 insurers"],
            ["POST", "/api/seed", "Seed MongoDB from static catalogue (idempotent)"],
          ],
          [1200, 3200, 4960]
        ),
        spacer(),

        // ── 6. Non-Functional Requirements ────────────────────────────────
        pageBreak(),
        heading1("6. Non-Functional Requirements"),
        makeTable(
          ["Requirement", "Detail"],
          [
            ["Availability", "Auto-seeds the database on the first BFF request if the collection is empty"],
            ["AI Fallback", "AI advisor degrades gracefully to rule-based engine if OPENAI_API_KEY is absent or the call fails"],
            ["DB Fallback", "Variant comparison falls back to static CAR_VARIANTS if MongoDB is unavailable"],
            ["Idempotency", "POST /api/seed is safe to call multiple times without duplicating data"],
            ["Environment", "Requires MONGODB_URI and NEXT_PUBLIC_BASE_URL; OPENAI_API_KEY is optional"],
            ["Framework", "Next.js 16, TypeScript, Tailwind CSS v4, ShadCN UI, Mongoose, OpenAI SDK"],
            ["State Management", "React Context API (compare state shared across Browse and Compare pages)"],
          ],
          [2500, 6860]
        ),
        spacer(),

        // ── 7. Out of Scope ────────────────────────────────────────────────
        heading1("7. Out of Scope (v1.0)"),
        bullet("User authentication and account management"),
        bullet("Payment processing or booking deposits"),
        bullet("Real dealer inventory / live OEM API integration"),
        bullet("Push or email notifications"),
        bullet("Admin dashboard UI (leads are accessible via API only)"),
        bullet("Mobile native application"),
        spacer(),

        // ── 8. Module Architecture ─────────────────────────────────────────
        heading1("8. Module Architecture"),
        makeTable(
          ["Module", "Files", "Responsibility"],
          [
            ["car", "car.schema.ts, car.service.ts", "getCars(), getCarById(), getFeaturedCars(), seedCars()"],
            ["comparison", "comparison.schema.ts, comparison.service.ts", "compareCarIds() + compareVariantIds() \u2192 table + winner + insights"],
            ["ai", "ai.service.ts", "processAdvisorQuery() \u2014 OpenAI + rule-based fallback"],
            ["leads", "lead.schema.ts, lead.service.ts", "createLead(), getLeads()"],
            ["finance", "finance.service.ts", "computeLoanOffers(), computeInsurance()"],
            ["usedCars", "usedCar.service.ts", "getUsedCars() with filters"],
          ],
          [1800, 3000, 4560]
        ),
        spacer(),
        heading2("8.1  BFF Layer"),
        makeTable(
          ["BFF File", "Exported Function", "Used By"],
          [
            ["explore.api.ts", "getExplorePageData()", "GET /api/bff/explore-page-data"],
            ["compare.api.ts", "compareExperience()", "POST /api/bff/compare"],
            ["advisor.api.ts", "advisorExperience()", "POST /api/bff/advisor"],
          ],
          [2500, 3000, 3860]
        ),
        spacer(),

        // ── End ─────────────────────────────────────────────────────────────
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 720 },
          children: [new TextRun({ text: "\u2014  End of Document  \u2014", italics: true, color: "888888", font: "Arial", size: 20 })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("DriveX_FRS_v1.0.docx", buffer);
  console.log("Done: DriveX_FRS_v1.0.docx");
});
