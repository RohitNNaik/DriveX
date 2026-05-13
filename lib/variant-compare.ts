import { CAR_VARIANTS } from "@/lib/data";
import { Car, FuelType, TransmissionType } from "@/lib/types";

export type FeatureCategory = "safety" | "comfort" | "technology" | "exterior";

export interface ComparableVariant {
  id: string;
  brand: string;
  model: string;
  variant: string;
  name: string;
  price: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  mileage: number;
  engineCC: number;
  power: number;
  torque: number;
  airbags: number;
  rating: number;
  image: string;
  features: Record<FeatureCategory, string[]>;
}

export interface ModelGroup {
  brand: string;
  model: string;
  variantCount: number;
}

const FEATURE_ORDER: Record<FeatureCategory, string[]> = {
  safety: [
    "2 airbags",
    "6 airbags",
    "ABS with EBD",
    "ESC",
    "Hill start assist",
    "ISOFIX mounts",
    "Rear parking sensors",
    "Rear parking camera",
    "360-degree camera",
    "Tyre pressure monitor",
    "Blind view monitor",
    "ADAS",
    "All-wheel disc brakes",
    "4WD",
  ],
  comfort: [
    "Manual AC",
    "Automatic climate control",
    "Rear AC vents",
    "Cruise control",
    "Push-button start",
    "Rear armrest",
    "Height-adjustable driver seat",
    "Ventilated front seats",
    "Leatherette upholstery",
    "Captain seats",
    "Panoramic sunroof",
  ],
  technology: [
    "Bluetooth audio",
    "USB charging",
    "7-inch infotainment",
    "8-inch infotainment",
    "9-inch infotainment",
    "10.25-inch infotainment",
    "Digital instrument cluster",
    "Wireless Android Auto / Apple CarPlay",
    "Wireless charger",
    "Connected car tech",
    "Bose sound system",
    "Sony sound system",
    "Fast charging",
    "Vehicle-to-load",
    "Drive modes",
  ],
  exterior: [
    "Body-colored mirrors",
    "Wheel covers",
    "16-inch steel wheels",
    "16-inch alloys",
    "17-inch alloys",
    "LED DRLs",
    "LED projector headlamps",
    "LED tail lamps",
    "Roof rails",
    "Fog lamps",
    "Skid plates",
    "Sunroof spoiler",
  ],
};

const STATIC_VARIANT_FEATURES: Record<string, Record<FeatureCategory, string[]>> = {
  "creta-e-petrol-mt": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors"],
    comfort: ["Manual AC", "Rear AC vents", "Height-adjustable driver seat"],
    technology: ["8-inch infotainment", "Bluetooth audio", "USB charging"],
    exterior: ["Body-colored mirrors", "16-inch steel wheels", "LED DRLs"],
  },
  "creta-s-petrol-at": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Height-adjustable driver seat", "Panoramic sunroof"],
    technology: ["8-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay", "Digital instrument cluster"],
    exterior: ["Body-colored mirrors", "16-inch alloys", "LED DRLs", "LED projector headlamps", "Roof rails"],
  },
  "creta-sx-diesel-at": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera", "Tyre pressure monitor"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Height-adjustable driver seat", "Leatherette upholstery", "Panoramic sunroof"],
    technology: ["10.25-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay", "Digital instrument cluster", "Connected car tech", "Wireless charger"],
    exterior: ["Body-colored mirrors", "17-inch alloys", "LED DRLs", "LED projector headlamps", "LED tail lamps", "Roof rails", "Fog lamps"],
  },
  "creta-sxo-turbo-petrol-dct": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera", "360-degree camera", "Tyre pressure monitor", "Blind view monitor", "ADAS"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Height-adjustable driver seat", "Ventilated front seats", "Leatherette upholstery", "Panoramic sunroof"],
    technology: ["10.25-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay", "Digital instrument cluster", "Connected car tech", "Wireless charger", "Bose sound system", "Drive modes"],
    exterior: ["Body-colored mirrors", "17-inch alloys", "LED DRLs", "LED projector headlamps", "LED tail lamps", "Roof rails", "Fog lamps"],
  },
  "nexon-ev-medium-range": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "ISOFIX mounts", "Rear parking sensors", "Rear parking camera"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Leatherette upholstery"],
    technology: ["10.25-inch infotainment", "Digital instrument cluster", "Wireless Android Auto / Apple CarPlay", "Connected car tech", "Drive modes"],
    exterior: ["16-inch alloys", "LED DRLs", "LED projector headlamps", "LED tail lamps", "Roof rails"],
  },
  "nexon-ev-long-range": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "ISOFIX mounts", "Rear parking sensors", "Rear parking camera", "360-degree camera", "Tyre pressure monitor"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Ventilated front seats", "Leatherette upholstery", "Panoramic sunroof"],
    technology: ["10.25-inch infotainment", "Digital instrument cluster", "Wireless Android Auto / Apple CarPlay", "Connected car tech", "Wireless charger", "Fast charging", "Vehicle-to-load", "Drive modes"],
    exterior: ["16-inch alloys", "LED DRLs", "LED projector headlamps", "LED tail lamps", "Roof rails", "Fog lamps"],
  },
  "swift-lxi-petrol-mt": {
    safety: ["2 airbags", "ABS with EBD", "Rear parking sensors"],
    comfort: ["Manual AC"],
    technology: ["Bluetooth audio", "USB charging"],
    exterior: ["Wheel covers", "Body-colored mirrors"],
  },
  "swift-vxi-petrol-mt": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera"],
    comfort: ["Manual AC", "Rear AC vents", "Height-adjustable driver seat"],
    technology: ["7-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay"],
    exterior: ["Wheel covers", "Body-colored mirrors", "LED DRLs"],
  },
  "swift-zxi-plus-cng": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Height-adjustable driver seat"],
    technology: ["9-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay", "Wireless charger"],
    exterior: ["16-inch alloys", "Body-colored mirrors", "LED DRLs", "LED projector headlamps", "Fog lamps"],
  },
  "swift-zxi-plus-at": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors", "Rear parking camera", "360-degree camera"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Height-adjustable driver seat"],
    technology: ["9-inch infotainment", "Bluetooth audio", "USB charging", "Wireless Android Auto / Apple CarPlay", "Wireless charger", "Drive modes"],
    exterior: ["16-inch alloys", "Body-colored mirrors", "LED DRLs", "LED projector headlamps", "Fog lamps"],
  },
  "scorpio-n-z2-petrol-mt": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "Rear parking sensors"],
    comfort: ["Manual AC", "Rear AC vents", "Cruise control"],
    technology: ["8-inch infotainment", "Bluetooth audio", "USB charging"],
    exterior: ["17-inch alloys", "LED DRLs", "Roof rails", "Skid plates"],
  },
  "scorpio-n-z8-diesel-at-4wd": {
    safety: ["6 airbags", "ABS with EBD", "ESC", "Hill start assist", "ISOFIX mounts", "Rear parking sensors", "Rear parking camera", "360-degree camera", "Tyre pressure monitor", "ADAS", "4WD"],
    comfort: ["Automatic climate control", "Rear AC vents", "Cruise control", "Push-button start", "Leatherette upholstery", "Captain seats", "Panoramic sunroof"],
    technology: ["10.25-inch infotainment", "Digital instrument cluster", "Wireless Android Auto / Apple CarPlay", "Connected car tech", "Wireless charger", "Sony sound system", "Drive modes"],
    exterior: ["17-inch alloys", "LED DRLs", "LED projector headlamps", "LED tail lamps", "Roof rails", "Fog lamps", "Skid plates"],
  },
};

const FEATURE_ALIAS: Record<string, string> = {
  "Sunroof spoiler": "Panoramic sunroof",
};

export function slugifyModel(brand: string, model: string) {
  return `${brand}-${model}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeFeature(feature: string) {
  return FEATURE_ALIAS[feature] ?? feature;
}

export function variantHasFeature(
  variant: ComparableVariant,
  category: FeatureCategory,
  feature: string
) {
  return variant.features[category].some((item) => normalizeFeature(item) === normalizeFeature(feature));
}

function getStaticFeatureMap(carId: string): Record<FeatureCategory, string[]> {
  return (
    STATIC_VARIANT_FEATURES[carId] ?? {
      safety: [],
      comfort: [],
      technology: [],
      exterior: [],
    }
  );
}

function toComparableVariant(car: Car): ComparableVariant {
  return {
    id: car.id,
    brand: car.brand,
    model: car.model,
    variant: car.variant ?? car.name,
    name: car.name,
    price: car.price,
    fuelType: car.fuelType,
    transmission: car.transmission,
    mileage: car.mileage,
    engineCC: car.engineCC,
    power: car.power,
    torque: car.torque,
    airbags: car.airbags,
    rating: car.rating,
    image: car.image,
    features: getStaticFeatureMap(car.id),
  };
}

export function getStaticModelGroupBySlug(slug: string): ModelGroup | null {
  const counts = new Map<string, ModelGroup>();

  for (const car of CAR_VARIANTS) {
    const key = slugifyModel(car.brand, car.model);
    const existing = counts.get(key);
    if (existing) {
      existing.variantCount += 1;
    } else {
      counts.set(key, { brand: car.brand, model: car.model, variantCount: 1 });
    }
  }

  const directMatch = counts.get(slug.toLowerCase());
  if (directMatch) return directMatch;

  return (
    [...counts.values()].find(
      (group) =>
        group.model.toLowerCase() === slug.toLowerCase() ||
        slugifyModel(group.brand, group.model) === slug.toLowerCase()
    ) ?? null
  );
}

export function getComparableVariantsForModel(brand: string, model: string) {
  return CAR_VARIANTS.filter(
    (car) =>
      car.brand.toLowerCase() === brand.toLowerCase() &&
      car.model.toLowerCase() === model.toLowerCase()
  )
    .map(toComparableVariant)
    .sort((left, right) => left.price - right.price);
}

export function enrichComparableVariants(rawVariants: Array<Record<string, unknown>>) {
  return rawVariants
    .map((item) => {
      const id = String(item._id ?? item.id ?? "");
      const brand = String(item.brand ?? "");
      const model = String(item.model ?? "");
      const variant = String(item.variant ?? item.name ?? "");

      const staticMatch = CAR_VARIANTS.find(
        (car) =>
          car.id === id ||
          (car.brand.toLowerCase() === brand.toLowerCase() &&
            car.model.toLowerCase() === model.toLowerCase() &&
            (car.variant ?? car.name).toLowerCase() === variant.toLowerCase())
      );

      const features = staticMatch ? getStaticFeatureMap(staticMatch.id) : getStaticFeatureMap(id);

      return {
        id,
        brand,
        model,
        variant,
        name: String(item.name ?? variant),
        price: Number(item.price ?? staticMatch?.price ?? 0),
        fuelType: (item.fuelType ?? staticMatch?.fuelType ?? "Petrol") as FuelType,
        transmission: (item.transmission ?? staticMatch?.transmission ?? "Manual") as TransmissionType,
        mileage: Number(item.mileage ?? staticMatch?.mileage ?? 0),
        engineCC: Number(item.engineCC ?? staticMatch?.engineCC ?? 0),
        power: Number(item.power ?? staticMatch?.power ?? 0),
        torque: Number(item.torque ?? staticMatch?.torque ?? 0),
        airbags: Number(item.airbags ?? staticMatch?.airbags ?? 0),
        rating: Number(item.rating ?? staticMatch?.rating ?? 0),
        image: String(item.image ?? staticMatch?.image ?? ""),
        features,
      } satisfies ComparableVariant;
    })
    .sort((left, right) => left.price - right.price);
}

export function getFeatureRows(
  variants: ComparableVariant[],
  category: FeatureCategory
) {
  const features = new Set<string>();

  for (const variant of variants) {
    for (const feature of variant.features[category]) {
      features.add(normalizeFeature(feature));
    }
  }

  return [...features].sort((left, right) => {
    const leftIndex = FEATURE_ORDER[category].indexOf(left);
    const rightIndex = FEATURE_ORDER[category].indexOf(right);

    if (leftIndex === -1 && rightIndex === -1) return left.localeCompare(right);
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  });
}

function getAllNormalizedFeatures(variant: ComparableVariant) {
  return new Set(
    (Object.keys(variant.features) as FeatureCategory[]).flatMap((category) =>
      variant.features[category].map(normalizeFeature)
    )
  );
}

export function compareVariantUpgrade(from: ComparableVariant, to: ComparableVariant) {
  const fromFeatures = getAllNormalizedFeatures(from);
  const toFeatures = getAllNormalizedFeatures(to);

  const gained = [...toFeatures].filter((feature) => !fromFeatures.has(feature));
  const lost = [...fromFeatures].filter((feature) => !toFeatures.has(feature));
  const priceDelta = to.price - from.price;

  const powerGain = Math.max(0, to.power - from.power) / 2;
  const torqueGain = Math.max(0, to.torque - from.torque) / 8;
  const mileageGain = Math.max(0, to.mileage - from.mileage) * 2;
  const safetyGain = Math.max(0, to.airbags - from.airbags) * 3 + Math.max(0, to.rating - from.rating) * 8;
  const pricePenalty = Math.max(0, priceDelta / 100000) * 6;

  const upgradeScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(58 + gained.length * 7 - lost.length * 9 + powerGain + torqueGain + mileageGain + safetyGain - pricePenalty)
    )
  );

  return {
    priceDelta,
    gained,
    lost,
    upgradeScore,
  };
}
