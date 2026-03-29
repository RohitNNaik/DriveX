import { connectDB } from "@/lib/db/mongoose";
import { CarModel } from "@/modules/car/car.schema";
import { ComparisonModel, ComparisonRow } from "./comparison.schema";
import { CAR_VARIANTS } from "@/lib/data";

const SPEC_ROWS: Array<{
  label: string;
  field: string;
  higherIsBetter: boolean;
  format?: (v: unknown) => string;
}> = [
  { label: "Price (₹)", field: "price", higherIsBetter: false, format: (v) => `₹${Number(v).toLocaleString("en-IN")}` },
  { label: "Mileage (kmpl)", field: "mileage", higherIsBetter: true, format: (v) => v === 0 ? "Electric" : `${v} kmpl` },
  { label: "Power (bhp)", field: "power", higherIsBetter: true, format: (v) => `${v} bhp` },
  { label: "Torque (Nm)", field: "torque", higherIsBetter: true, format: (v) => `${v} Nm` },
  { label: "Engine (cc)", field: "engineCC", higherIsBetter: true, format: (v) => v === 0 ? "Electric Motor" : `${v} cc` },
  { label: "Seating", field: "seating", higherIsBetter: true, format: (v) => `${v} seats` },
  { label: "Airbags", field: "airbags", higherIsBetter: true, format: (v) => `${v}` },
  { label: "Rating", field: "rating", higherIsBetter: true, format: (v) => `${v}/5` },
  { label: "Fuel Type", field: "fuelType", higherIsBetter: false },
  { label: "Transmission", field: "transmission", higherIsBetter: false },
  { label: "Body Type", field: "bodyType", higherIsBetter: false },
];

function pickWinnerIndex(values: unknown[], higherIsBetter: boolean): number | undefined {
  const nums = values.map((v) => (typeof v === "number" ? v : NaN));
  if (nums.some(isNaN)) return undefined;
  const target = higherIsBetter ? Math.max(...nums) : Math.min(...nums);
  const idx = nums.indexOf(target);
  // No winner if all values are equal
  return nums.every((n) => n === nums[0]) ? undefined : idx;
}

function computeOverallWinner(cars: Array<Record<string, unknown>>): {
  winner: string;
  insights: string[];
} {
  const scores = new Array<number>(cars.length).fill(0);
  const insights: string[] = [];

  for (const row of SPEC_ROWS) {
    if (!row.higherIsBetter && row.field !== "price") continue; // skip string fields for scoring
    const values = cars.map((c) => c[row.field] as number);
    const target = row.higherIsBetter ? Math.max(...values) : Math.min(...values);
    const winIdx = values.indexOf(target);
    if (!values.every((v) => v === values[0])) {
      scores[winIdx]++;
    }
  }

  const maxScore = Math.max(...scores);
  const winnerIdx = scores.indexOf(maxScore);
  const winnerCar = cars[winnerIdx];
  const winnerName = String(winnerCar.name);

  // Human-readable insights
  const priceSorted = [...cars].sort((a, b) => (a.price as number) - (b.price as number));
  if (priceSorted[0].name !== winnerName) {
    insights.push(`${priceSorted[0].name} is the most affordable option`);
  }

  const mileageSorted = [...cars].filter(c => (c.mileage as number) > 0).sort((a, b) => (b.mileage as number) - (a.mileage as number));
  if (mileageSorted.length > 0) {
    insights.push(`${mileageSorted[0].name} offers the best fuel economy at ${mileageSorted[0].mileage} kmpl`);
  }

  const powerSorted = [...cars].sort((a, b) => (b.power as number) - (a.power as number));
  insights.push(`${powerSorted[0].name} has the most powerful engine at ${powerSorted[0].power} bhp`);

  const ratingSorted = [...cars].sort((a, b) => (b.rating as number) - (a.rating as number));
  insights.push(`${ratingSorted[0].name} has the highest user rating (${ratingSorted[0].rating}/5)`);

  return { winner: winnerName, insights };
}

export async function compareCarIds(ids: string[]) {
  await connectDB();
  if (ids.length < 2 || ids.length > 3) {
    throw new Error("Provide 2 or 3 car IDs to compare");
  }

  const cars = await CarModel.find({ _id: { $in: ids } }).lean();
  if (cars.length < 2) throw new Error("Could not find enough cars with the provided IDs");

  const table: ComparisonRow[] = SPEC_ROWS.map((row) => {
    const rawValues = cars.map((c) => (c as Record<string, unknown>)[row.field]);
    const formattedValues = rawValues.map((v) => (row.format ? row.format(v) : String(v ?? "—")));
    const winner = pickWinnerIndex(rawValues, row.higherIsBetter);
    return { label: row.label, values: formattedValues, winner };
  });

  const { winner, insights } = computeOverallWinner(cars as unknown as Array<Record<string, unknown>>);

  // Persist comparison result
  const comparison = await ComparisonModel.create({
    carIds: ids,
    winner,
    insights,
    table,
  });

  return {
    id: comparison._id,
    mode: "different-cars" as const,
    cars: cars.map((c) => ({
      _id: c._id,
      name: c.name,
      brand: c.brand,
      price: c.price,
      image: c.image,
      variant: (c as Record<string, unknown>).variant,
    })),
    table,
    winner,
    insights,
  };
}

/**
 * Compare variants of the same car model.
 * Accepts variant IDs from MongoDB OR static CAR_VARIANTS ids.
 */
export async function compareVariantIds(ids: string[]) {
  await connectDB();
  if (ids.length < 2 || ids.length > 4) {
    throw new Error("Provide 2–4 variant IDs to compare");
  }

  // Try DB first, fall back to static data
  let cars = await CarModel.find({ _id: { $in: ids } }).lean() as unknown as Array<Record<string, unknown>>;

  if (cars.length < 2) {
    // Try static variant data by id field
    const staticVariants = CAR_VARIANTS.filter((v) => ids.includes(v.id));
    if (staticVariants.length >= 2) {
      cars = staticVariants as unknown as Array<Record<string, unknown>>;
    } else {
      throw new Error("Could not find enough variants with the provided IDs");
    }
  }

  // Verify they belong to the same model
  const models = [...new Set(cars.map((c) => String(c.model)))];
  if (models.length > 1) {
    throw new Error(`All IDs must belong to the same model. Found: ${models.join(", ")}`);
  }

  const table: ComparisonRow[] = SPEC_ROWS.map((row) => {
    const rawValues = cars.map((c) => c[row.field]);
    const formattedValues = rawValues.map((v) => (row.format ? row.format(v) : String(v ?? "—")));
    const winner = pickWinnerIndex(rawValues, row.higherIsBetter);
    return { label: row.label, values: formattedValues, winner };
  });

  const { winner, insights } = computeVariantWinner(cars);

  // Persist
  const comparison = await ComparisonModel.create({
    carIds: ids,
    winner,
    insights,
    table,
  });

  return {
    id: comparison._id,
    mode: "same-model-variants" as const,
    brand: String(cars[0].brand),
    model: String(cars[0].model),
    cars: cars.map((c) => ({
      _id: c._id,
      name: c.name,
      variant: c.variant ?? c.name,
      price: c.price,
      fuelType: c.fuelType,
      transmission: c.transmission,
    })),
    table,
    winner,
    insights,
  };
}

function computeVariantWinner(cars: Array<Record<string, unknown>>): {
  winner: string;
  insights: string[];
} {
  const scores = new Array<number>(cars.length).fill(0);
  const insights: string[] = [];

  for (const row of SPEC_ROWS) {
    if (!row.higherIsBetter && row.field !== "price") continue;
    const values = cars.map((c) => c[row.field] as number);
    if (values.some((v) => typeof v !== "number" || isNaN(v))) continue;
    const target = row.higherIsBetter ? Math.max(...values) : Math.min(...values);
    const winIdx = values.indexOf(target);
    if (!values.every((v) => v === values[0])) scores[winIdx]++;
  }

  const maxScore = Math.max(...scores);
  const winnerIdx = scores.indexOf(maxScore);
  const winnerCar = cars[winnerIdx];
  const winnerLabel = String(winnerCar.variant ?? winnerCar.name);

  const priceSorted = [...cars].sort((a, b) => (a.price as number) - (b.price as number));
  insights.push(`${priceSorted[0].variant ?? priceSorted[0].name} is the most affordable variant at ₹${Number(priceSorted[0].price).toLocaleString("en-IN")}`);

  const topPrice = cars.reduce((a, b) => ((a.price as number) > (b.price as number) ? a : b));
  const bottomPrice = cars.reduce((a, b) => ((a.price as number) < (b.price as number) ? a : b));
  const priceDiff = (topPrice.price as number) - (bottomPrice.price as number);
  insights.push(`Price gap across variants: ₹${priceDiff.toLocaleString("en-IN")}`);

  const mileageValid = cars.filter(c => (c.mileage as number) > 0);
  if (mileageValid.length > 0) {
    const best = mileageValid.reduce((a, b) => ((a.mileage as number) > (b.mileage as number) ? a : b));
    insights.push(`${best.variant ?? best.name} offers the best mileage at ${best.mileage} kmpl`);
  }

  const powerBest = cars.reduce((a, b) => ((a.power as number) > (b.power as number) ? a : b));
  insights.push(`${powerBest.variant ?? powerBest.name} is the most powerful at ${powerBest.power} bhp`);

  return { winner: winnerLabel, insights };
}
