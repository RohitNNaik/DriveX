import { getAIRecommendation } from "@/lib/ai-engine";
import { connectDB } from "@/lib/db/mongoose";
import { CarModel } from "@/modules/car/car.schema";
import { Car } from "@/lib/types";

export interface AdvisorInput {
  query: string;
  city?: string;
  budget?: number; // override in INR
}

export interface AdvisorResponse {
  text: string;
  suggestions: Car[];
  source: "openai" | "rule-based";
}

/**
 * Tries OpenAI first (if OPENAI_API_KEY is set) then falls back to rule-based engine.
 * Returns matched Car documents from MongoDB so callers get live DB data.
 */
export async function processAdvisorQuery(input: AdvisorInput): Promise<AdvisorResponse> {
  let query = input.query;
  if (input.city) query += ` in ${input.city}`;
  if (input.budget) query += ` under ${Math.round(input.budget / 100000)}L`;

  // Try OpenAI if key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      return await openAIAdvisor(query, input);
    } catch (err) {
      console.warn("[AI Advisor] OpenAI call failed, falling back to rule-based:", err);
    }
  }

  return ruleBasedAdvisor(query);
}

async function ruleBasedAdvisor(query: string): Promise<AdvisorResponse> {
  const result = getAIRecommendation(query);

  // Try to hydrate from DB if connected; fall back to static data
  let suggestions: Car[] = result.suggestions;
  try {
    await connectDB();
    const names = result.suggestions.map((c) => c.name);
    if (names.length > 0) {
      const dbCars = await CarModel.find({ name: { $in: names }, isUsed: false }).lean();
      if (dbCars.length > 0) {
        // keep original order
        suggestions = names
          .map((n) => dbCars.find((c) => c.name === n) as unknown as Car)
          .filter(Boolean);
      }
    }
  } catch {
    // DB not available – use static data
  }

  return { text: result.text, suggestions, source: "rule-based" };
}

async function openAIAdvisor(query: string, input: AdvisorInput): Promise<AdvisorResponse> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  await connectDB();
  const allCars = await CarModel.find({ isUsed: false }).lean();

  const carCatalogue = allCars
    .map(
      (c) =>
        `${c.name} | ₹${(c.price / 100000).toFixed(1)}L | ${c.fuelType} | ${c.bodyType} | ${c.mileage} kmpl | ${c.power} bhp | Tags: ${c.tags?.join(", ")} | Rating: ${c.rating}/5`
    )
    .join("\n");

  const systemPrompt = `You are DriveX AI, India's smartest car advisor. 
You have access to this car catalogue:
${carCatalogue}

Rules:
- Recommend exactly 2–3 cars by name from the catalogue only
- Reply with: one line explanation, then a JSON block like: \`\`\`json\n["Car Name 1","Car Name 2"]\`\`\`
- Be concise and friendly. Use ₹ and Indian context.`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: query },
    ],
    max_tokens: 400,
    temperature: 0.7,
  });

  const message = completion.choices[0]?.message?.content ?? "";

  // Extract recommended car names from JSON block
  const jsonMatch = message.match(/```json\s*([\s\S]*?)```/);
  let suggestions: Car[] = [];

  if (jsonMatch) {
    try {
      const names: string[] = JSON.parse(jsonMatch[1]);
      const dbCars = await CarModel.find({ name: { $in: names }, isUsed: false }).lean();
      suggestions = names
        .map((n) => dbCars.find((c) => c.name === n) as unknown as Car)
        .filter(Boolean);
    } catch {
      // fall through to rule-based
    }
  }

  const text = message.replace(/```json[\s\S]*?```/g, "").trim();

  // If OpenAI gave no usable results, fall back
  if (suggestions.length === 0) {
    return ruleBasedAdvisor(input.query);
  }

  return { text, suggestions, source: "openai" };
}
