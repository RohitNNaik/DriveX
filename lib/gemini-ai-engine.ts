import { Car } from "./types";
import { CARS } from "./data";

interface AIResponse {
  text: string;
  suggestions: Car[];
  responseType?: "greeting" | "recommendation" | "general" | "comparison" | "specification";
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

interface QueryIntent {
  type: "greeting" | "recommendation" | "general_question" | "comparison" | "specification";
  isGreeting: boolean;
  isRecommendation: boolean;
  isComparison: boolean;
  isSpecification: boolean;
  carBrands?: string[];
}

/**
 * Detect the intent of the user query
 */
function detectQueryIntent(query: string): QueryIntent {
  const q = query.toLowerCase().trim();

  // Greeting detection
  const greetingPatterns = /^(hi|hello|hey|greetings?|namaste|what'?s?up|good morning|good afternoon|good evening|howdy)\b/;
  const isGreeting = greetingPatterns.test(q);

  // Recommendation patterns
  const recommendationPatterns = /\b(best|recommend|suggest|find|look for|need|want|searching for|looking for)\b/i;
  const hasRecommendationKeyword = recommendationPatterns.test(q);
  const hasBudgetOrPreference =
    /(\d+\s*(?:l|lakh|cr|crore)|electric|diesel|petrol|suv|sedan|family|city|highway)/i.test(q);

  const isRecommendation = hasRecommendationKeyword && hasBudgetOrPreference && !isGreeting;

  // Comparison detection
  const comparisonPatterns = /\b(compare|vs|versus|difference|better|which is better)\b/i;
  const isComparison = comparisonPatterns.test(q) && !isGreeting;

  // Specification/Knowledge question detection
  const specificationPatterns = /\b(what|how|why|tell|explain|feature|spec|specification|mileage|price|cost|engine|power|fuel|consumption)\b/i;
  const isSpecification = specificationPatterns.test(q) && !isGreeting && !isRecommendation;

  // Extract car brands mentioned
  const brands = ["maruti", "hyundai", "tata", "toyota", "mahindra", "honda", "volkswagen", "skoda"];
  const mentionedBrands = brands.filter(b => q.includes(b));

  return {
    type: isGreeting ? "greeting" : isComparison ? "comparison" : isSpecification ? "specification" : isRecommendation ? "recommendation" : "general_question",
    isGreeting,
    isRecommendation,
    isComparison,
    isSpecification,
    carBrands: mentionedBrands,
  };
}

/**
 * Generate greeting response
 */
function generateGreetingResponse(): string {
  const greetings = [
    "👋 Hi there! Welcome to Safar, your AI-powered car buying assistant!\n\nI'm here to help you find your dream car. I can:\n✅ Recommend cars based on your budget and preferences\n✅ Answer questions about car features, specs, and pricing\n✅ Compare different cars side-by-side\n✅ Help you understand fuel efficiency, safety ratings, and more\n\nWhat are you looking for today? Tell me about your dream car! 🚗",
    "Hey! 👋 Welcome to your personal car advisor!\n\nWhether you're looking for a budget-friendly hatchback, a spacious family SUV, or an eco-friendly electric car, I've got you covered. Just tell me:\n• Your budget\n• What type of car you want\n• How you'll use it (city, highway, family trips)\n\nAnd I'll find the perfect matches! What's your dream car? 🎯",
    "Hello! 🚗 Welcome to Safar AI Advisor!\n\nI can help you:\n🔍 Find the best cars matching your needs\n💰 Understand pricing and financing options\n⚡ Learn about different fuel types\n🏠 Get recommendations for city or highway driving\n👨‍👩‍👧‍👦 Find family-friendly vehicles\n\nTell me what you're looking for, and let's find your perfect car! ✨",
  ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}

/**
 * Search database for cars matching criteria
 */
function searchCarsInDatabase(query: string, brands?: string[]): Car[] {
  let filtered = CARS;

  // Filter by mentioned brands
  if (brands && brands.length > 0) {
    filtered = filtered.filter(car =>
      brands.some(b => car.brand.toLowerCase().includes(b))
    );
  }

  // Filter by keywords in name
  const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  filtered = filtered.filter(car =>
    keywords.some(k =>
      car.name.toLowerCase().includes(k) ||
      car.model.toLowerCase().includes(k) ||
      car.fuelType.toLowerCase().includes(k)
    )
  );

  return filtered.slice(0, 5);
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
 * Answer general car questions using Gemini API with database context
 */
async function answerGeneralQuestion(
  query: string,
  relatedCars: Car[]
): Promise<string> {
  try {
    // Build context from database
    const carsContext = relatedCars.length > 0
      ? `\nHere are some relevant cars in our database:\n${relatedCars
          .map(c => `- ${c.name}: ₹${(c.price / 100000).toFixed(1)}L, ${c.fuelType}, ${c.bodyType}, Rating: ${c.rating}/5`)
          .join("\n")}`
      : "";

    const prompt = `You are an expert car advisor with deep knowledge of Indian automobile market. 
    
User Question: "${query}"
${carsContext}

Provide a comprehensive, friendly answer that:
1. Directly addresses the user's question
2. Includes practical examples if relevant
3. Mentions specific cars from the database if applicable
4. Gives actionable advice
5. Keeps the tone conversational and helpful

Answer concisely (2-3 sentences) but informatively.`;

    return await callGemini(prompt);
  } catch (error) {
    console.error("Failed to answer general question:", error);
    // Fallback response
    return "I'm having trouble accessing detailed information right now. Could you rephrase your question or tell me more specifically what car information you need? I can help with recommendations, comparisons, or answer questions about specific cars! 🚗";
  }
}

/**
 * Answer comparison questions
 */
async function answerComparisonQuestion(
  query: string,
  relatedCars: Car[]
): Promise<{ text: string; cars: Car[] }> {
  try {
    const carsInfo = relatedCars.map(c => ({
      name: c.name,
      price: `₹${(c.price / 100000).toFixed(1)}L`,
      fuelType: c.fuelType,
      bodyType: c.bodyType,
      mileage: `${c.mileage} kmpl`,
      rating: `${c.rating}/5`,
      pros: c.pros.join(", "),
      cons: c.cons.join(", "),
    }));

    const prompt = `You are a car comparison expert. The user asked: "${query}"

Here are the cars to compare:
${JSON.stringify(carsInfo, null, 2)}

Provide a brief comparison (2-3 sentences) highlighting:
1. Key differences between the cars
2. Which is better for what use case
3. Overall recommendation

Be conversational and helpful.`;

    const response = await callGemini(prompt);
    return {
      text: response,
      cars: relatedCars.slice(0, 3),
    };
  } catch (error) {
    console.error("Failed to answer comparison question:", error);
    return {
      text: "I'd be happy to help you compare cars! Could you specify which cars you'd like to compare? For example: 'Compare Hyundai Creta vs Maruti Brezza' 🚗",
      cars: relatedCars.slice(0, 3),
    };
  }
}

/**
 * Answer specification/technical questions
 */
async function answerSpecificationQuestion(
  query: string,
  relatedCars: Car[]
): Promise<{ text: string; cars: Car[] }> {
  try {
    const carsData = relatedCars.map(c => ({
      name: c.name,
      engineCC: c.engineCC,
      power: `${c.power} bhp`,
      torque: `${c.torque} Nm`,
      mileage: `${c.mileage} kmpl`,
      transmission: c.transmission,
      price: `₹${(c.price / 100000).toFixed(1)}L`,
      airbags: c.airbags,
      seating: c.seating,
    }));

    const prompt = `You are a technical car advisor. Answer this question: "${query}"

Reference data from these cars:
${JSON.stringify(carsData, null, 2)}

Provide a technical but easy-to-understand answer (2-3 sentences) that:
1. Explains the concept clearly
2. Uses examples from the cars if relevant
3. Gives practical context for the Indian market

Be helpful and conversational.`;

    const response = await callGemini(prompt);
    return {
      text: response,
      cars: relatedCars.slice(0, 3),
    };
  } catch (error) {
    console.error("Failed to answer specification question:", error);
    return {
      text: "I'd love to help you understand car specs! Could you be more specific about what you'd like to know? For example: 'What does bhp mean?', 'How is fuel efficiency calculated?', etc. 🔧",
      cars: relatedCars.slice(0, 3),
    };
  }
}
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
 * Main AI advisor function - handles all types of queries
 * Supports: greetings, recommendations, comparisons, general questions, and specifications
 */
export async function getAIAdvisorResponse(query: string): Promise<AIResponse> {
  try {
    // Detect query intent
    const intent = detectQueryIntent(query);

    // Handle greeting
    if (intent.isGreeting) {
      return {
        text: generateGreetingResponse(),
        suggestions: [],
        responseType: "greeting",
      };
    }

    // Handle car recommendations
    if (intent.isRecommendation) {
      const requirements = extractRequirementsFromText(query);
      const allScored = filterAndScoreCars(requirements);
      const topCars = allScored
        .filter((s) => s.score > 0)
        .slice(0, 3)
        .map((s) => s.car);

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
        responseType: "recommendation",
      };
    }

    // Handle comparisons
    if (intent.isComparison) {
      const relatedCars = searchCarsInDatabase(query, intent.carBrands);
      const result = await answerComparisonQuestion(query, relatedCars);
      return {
        text: result.text,
        suggestions: result.cars,
        responseType: "comparison",
      };
    }

    // Handle specifications/technical questions
    if (intent.isSpecification) {
      const relatedCars = searchCarsInDatabase(query, intent.carBrands);
      const result = await answerSpecificationQuestion(query, relatedCars);
      return {
        text: result.text,
        suggestions: result.cars,
        responseType: "specification",
      };
    }

    // Handle general questions
    const relatedCars = searchCarsInDatabase(query, intent.carBrands);
    const answer = await answerGeneralQuestion(query, relatedCars);

    return {
      text: answer,
      suggestions: relatedCars.slice(0, 3),
      responseType: "general",
    };
  } catch (error) {
    console.error("AI advisor error:", error);
    return {
      text: "I encountered an issue processing your request. Please try asking me about:\n• Car recommendations (e.g., 'Best SUV under 15 lakhs')\n• Car comparisons (e.g., 'Compare Creta vs Brezza')\n• Car specifications (e.g., 'What is fuel efficiency?')\n• General car questions\n\nFeel free to ask anything! 🚗",
      suggestions: [],
      responseType: "general",
    };
  }
}
