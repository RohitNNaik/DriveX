import { Car } from "./types";
import { CARS } from "./data";

interface AIResponse {
  text: string;
  suggestions: Car[];
}

interface ExtractedRequirements {
  maxBudget: number | null;
  minBudget: number | null;
  fuelTypes: string[];
  bodyTypes: string[];
  usageScenarios: string[];
  features: string[];
  rawQuery: string;
}

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/**
 * Call Gemini API to process text
 */
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || response.statusText}`
      );
    }

    const data = await response.json();
    const content =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";
    return content;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw error;
  }
}

/**
 * Extract requirements from user query using pattern matching
 * Falls back to basic parsing if Gemini is unavailable
 */
function extractRequirementsFromText(query: string): ExtractedRequirements {
  const q = query.toLowerCase();
  const requirements: ExtractedRequirements = {
    maxBudget: null,
    minBudget: null,
    fuelTypes: [],
    bodyTypes: [],
    usageScenarios: [],
    features: [],
    rawQuery: query,
  };

  // Budget detection - handle "10L", "1Cr", "under X", "below X"
  const budgetMatch = q.match(/(\d+(?:\.\d+)?)\s*(l|lakh|lac|lakhs)/i);
  if (budgetMatch) {
    requirements.maxBudget = parseFloat(budgetMatch[1]) * 100000;
  }

  const croreMatch = q.match(/(\d+(?:\.\d+)?)\s*(cr|crore)/i);
  if (croreMatch) {
    requirements.maxBudget = parseFloat(croreMatch[1]) * 10000000;
  }

  // Fuel type detection
  if (/electric|ev|battery|zero emission|eco|green/.test(q))
    requirements.fuelTypes.push("Electric");
  if (/diesel/.test(q)) requirements.fuelTypes.push("Diesel");
  if (/petrol|gas/.test(q)) requirements.fuelTypes.push("Petrol");
  if (/hybrid/.test(q)) requirements.fuelTypes.push("Hybrid");
  if (/cng/.test(q)) requirements.fuelTypes.push("CNG");

  // Body type detection
  if (/\bsuv\b|compact suv|crossover/.test(q))
    requirements.bodyTypes.push("SUV");
  if (/\bsedan\b/.test(q)) requirements.bodyTypes.push("Sedan");
  if (/\bhatchback\b|hatch/.test(q)) requirements.bodyTypes.push("Hatchback");
  if (/\bmpv\b|minivan|7 seat|8 seat|family van/.test(q))
    requirements.bodyTypes.push("MPV");
  if (/coupe/.test(q)) requirements.bodyTypes.push("Coupe");

  // Usage scenario detection
  if (/city|traffic|bangalore|mumbai|delhi|hyderabad|urban|congestion/.test(q))
    requirements.usageScenarios.push("City");
  if (/highway|long drive|road trip|touring|commute/.test(q))
    requirements.usageScenarios.push("Highway");
  if (/family|kids|children|spacious|large/.test(q))
    requirements.usageScenarios.push("Family");
  if (/off.?road|adventure|terrain|mud/.test(q))
    requirements.usageScenarios.push("Off-road");
  if (/budget|cheap|affordable|inexpensive/.test(q))
    requirements.usageScenarios.push("Budget");

  // Feature extraction
  if (/sunroof|panoramic/.test(q)) requirements.features.push("Sunroof");
  if (/leather|premium/.test(q)) requirements.features.push("Premium interior");
  if (/safety|ncap|airbag/.test(q)) requirements.features.push("Safety");
  if (/fuel economy|mileage|efficient/.test(q))
    requirements.features.push("Fuel efficiency");
  if (/auto|automatic|transmission/.test(q))
    requirements.features.push("Automatic transmission");
  if (/manual/.test(q)) requirements.features.push("Manual transmission");

  return requirements;
}

/**
 * Score and filter cars based on extracted requirements
 */
function filterAndScoreCars(
  requirements: ExtractedRequirements
): Array<{ car: Car; score: number }> {
  const scored = CARS.map((car) => {
    let score = 0;

    // Budget scoring (highest priority)
    if (requirements.maxBudget !== null) {
      if (car.price <= requirements.maxBudget) {
        score += 15;
      } else if (car.price <= requirements.maxBudget * 1.1) {
        score += 8; // Within 10% of budget
      } else {
        score -= 10; // Over budget
      }
    } else {
      score += 2; // Small bonus for all if no budget specified
    }

    if (
      requirements.minBudget !== null &&
      car.price >= requirements.minBudget
    ) {
      score += 5;
    }

    // Fuel type matching
    if (
      requirements.fuelTypes.length > 0 &&
      requirements.fuelTypes.includes(car.fuelType)
    ) {
      score += 12;
    }

    // Body type matching
    if (
      requirements.bodyTypes.length > 0 &&
      requirements.bodyTypes.includes(car.bodyType)
    ) {
      score += 10;
    }

    // Usage scenario matching (tags)
    const matchingTags = car.tags.filter((tag) =>
      requirements.usageScenarios.includes(tag)
    );
    score += matchingTags.length * 6;

    // Feature preferences
    const hasFamily = requirements.usageScenarios.includes("Family");
    if (hasFamily && car.seating >= 7) {
      score += 8;
    }

    // Safety features bonus
    if (car.airbags >= 6) {
      score += 3;
    }

    // Rating boost
    score += car.rating * 2;

    return { car, score };
  });

  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Generate human-friendly response text
 */
function generateFallbackResponse(
  topCars: Car[],
  requirements: ExtractedRequirements
): string {
  if (topCars.length === 0) {
    return "I couldn't find matching cars with those exact requirements. Try broadening your budget or adjusting your preferences, and I'll find better matches for you.";
  }

  const carNames = topCars.map((c) => c.name).join(", ");
  const budgetStr =
    requirements.maxBudget !== null
      ? ` under ₹${(requirements.maxBudget / 100000).toFixed(0)}L`
      : "";
  const fuelStr =
    requirements.fuelTypes.length > 0
      ? ` ${requirements.fuelTypes.join("/")} powered`
      : "";

  let text = `Based on your requirements${budgetStr}${fuelStr}, I recommend: **${carNames}**.\n\n`;

  // Add helpful insights
  const insights: string[] = [];

  if (
    requirements.usageScenarios.includes("City") &&
    topCars.some((c) => c.tags.includes("City"))
  ) {
    insights.push(
      "These cars are great for city driving with good maneuverability and fuel efficiency."
    );
  }

  if (
    requirements.usageScenarios.includes("Family") &&
    topCars.some((c) => c.seating >= 7)
  ) {
    insights.push(
      "All of these have excellent seating capacity and safety features perfect for families."
    );
  }

  if (requirements.fuelTypes.includes("Electric")) {
    insights.push(
      "Going electric? You'll enjoy zero-emission driving with lower operational costs."
    );
  }

  if (requirements.features.length > 0) {
    insights.push(
      `These models offer the premium features you're looking for.`
    );
  }

  if (insights.length > 0) {
    text += insights.join(" ") + "\n\n";
  }

  text += 'Tap "Compare" on any car to see detailed specs and comparisons.';
  return text;
}

/**
 * Attempt to enhance response with Gemini (graceful fallback)
 */
async function enhanceResponseWithGemini(
  topCars: Car[],
  query: string
): Promise<string> {
  if (!GEMINI_API_KEY) {
    return generateFallbackResponse(
      topCars,
      extractRequirementsFromText(query)
    );
  }

  try {
    const carSummary = topCars
      .map((car) => {
        return `${car.name} (₹${(car.price / 100000).toFixed(1)}L, ${car.fuelType}, ${car.bodyType})`;
      })
      .join(", ");

    const prompt = `You are a friendly car advisor. The user asked: "${query}"
    
You recommend these cars: ${carSummary}

Write a brief, personalized response (1-2 sentences) explaining why these cars match their needs. Be conversational and helpful.`;

    return await callGemini(prompt);
  } catch (error) {
    console.error("Gemini enhancement failed, using fallback:", error);
    return generateFallbackResponse(
      topCars,
      extractRequirementsFromText(query)
    );
  }
}

/**
 * Main AI advisor function - agentic system with intelligent fallbacks
 */
export async function getAIAdvisorResponse(query: string): Promise<AIResponse> {
  try {
    // Step 1: Extract requirements using local pattern matching (always reliable)
    const requirements = extractRequirementsFromText(query);

    // Step 2: Filter and score cars
    const allScored = filterAndScoreCars(requirements);
    const topCars = allScored
      .filter((s) => s.score > 0)
      .slice(0, 3)
      .map((s) => s.car);

    // Step 3: Generate response (try Gemini, fallback to rule-based)
    let text: string;
    try {
      text = await enhanceResponseWithGemini(topCars, query);
    } catch (error) {
      console.warn("Using fallback response generation");
      text = generateFallbackResponse(topCars, requirements);
    }

    return {
      text,
      suggestions: topCars,
    };
  } catch (error) {
    console.error("AI advisor error:", error);
    return {
      text: "I encountered an error processing your request. Please try again with a clearer question about your car needs.",
      suggestions: [],
    };
  }
}
