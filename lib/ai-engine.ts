import { Car } from "./types";
import { CARS } from "./data";

interface AIResponse {
  text: string;
  suggestions: Car[];
}

// Rule-based AI engine that matches user queries to relevant cars
export function getAIRecommendation(query: string): AIResponse {
  const q = query.toLowerCase();

  // Budget detection
  const budgetMatch = q.match(/(\d+)\s*(l|lakh|lac|lakhs)/i);
  let maxBudget = Infinity;
  if (budgetMatch) {
    maxBudget = parseFloat(budgetMatch[1]) * 100000;
  }
  // Also detect "under X" or "below X" as raw digits (crores)
  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(cr|crore)/i);
  if (croreMatch) maxBudget = parseFloat(croreMatch[1]) * 10000000;

  // Fuel detection
  const wantsElectric = /electric|ev|battery|zero emission/.test(q);
  const wantsDiesel = /diesel/.test(q);
  const wantsPetrol = /petrol/.test(q);

  // Body type detection
  const wantsSUV = /suv|compact suv|crossover/.test(q);
  const wantsSedan = /sedan/.test(q);
  const wantsHatchback = /hatchback|hatch/.test(q);
  const wantsMPV = /mpv|minivan|7 seat|8 seat|family van/.test(q);

  // Usage scenarios
  const cityTraffic = /city|traffic|bangalore|mumbai|delhi|hyderabad|urban/.test(q);
  const longDrive = /highway|long drive|road trip|touring/.test(q);
  const family = /family|kids|children|spacious|8 seater|7 seater/.test(q);

  // Score cars
  const scored = CARS.map((car) => {
    let score = 0;

    if (car.price <= maxBudget) score += 5;
    if (wantsElectric && car.fuelType === "Electric") score += 4;
    if (wantsDiesel && car.fuelType === "Diesel") score += 4;
    if (wantsPetrol && car.fuelType === "Petrol") score += 4;
    if (wantsSUV && car.bodyType === "SUV") score += 3;
    if (wantsSedan && car.bodyType === "Sedan") score += 3;
    if (wantsHatchback && car.bodyType === "Hatchback") score += 3;
    if (wantsMPV && car.bodyType === "MPV") score += 3;
    if (cityTraffic && car.tags.includes("City")) score += 2;
    if (longDrive && car.tags.includes("Highway")) score += 2;
    if (family && (car.tags.includes("Family") || car.seating >= 7)) score += 2;

    // Baseline – always consider highly-rated cars
    score += car.rating * 0.3;

    return { car, score };
  });

  const top = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.car);

  // Generate a human-readable response
  let text = "";

  if (top.length === 0) {
    text = "I couldn't find matching cars. Try broadening your budget or changing requirements.";
  } else {
    const names = top.map((c) => c.name).join(", ");
    const budgetStr = maxBudget < Infinity
      ? ` under ₹${(maxBudget / 100000).toFixed(0)}L`
      : "";
    const usageStr = cityTraffic ? " for city use" : longDrive ? " for highway driving" : family ? " for families" : "";

    text = `Here are the best cars${budgetStr}${usageStr}: **${names}**.\n\n`;

    if (wantsElectric) {
      text += "Going electric? You'll save on fuel and get a smoother city drive. ";
    }
    if (cityTraffic) {
      text += "For city traffic, automatic transmission and good mileage are key. ";
    }
    if (family) {
      text += "For families, look at seating capacity, boot space, and safety ratings. ";
    }

    text += `\nTap \"+ Compare\" on any car to compare them side-by-side.`;
  }

  return { text, suggestions: top };
}
