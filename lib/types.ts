export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
export type TransmissionType = "Manual" | "Automatic";
export type BodyType = "SUV" | "Sedan" | "Hatchback" | "MPV" | "Coupe";
export type UsageTag = "City" | "Highway" | "Family" | "Off-road" | "Budget";

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  /** Human-readable variant label e.g. "S Petrol MT", "SX+ Diesel AT", "Long Range EV" */
  variant?: string;
  year: number;
  price: number; // in INR
  image: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  mileage: number; // kmpl
  seating: number;
  engineCC: number;
  power: number; // bhp
  torque: number; // Nm
  airbags: number;
  rating: number; // out of 5
  pros: string[];
  cons: string[];
  tags: UsageTag[];
  isUsed?: boolean;
  kmDriven?: number;
  owners?: number;
}

/** Lightweight card shown in variant pickers */
export interface VariantSummary {
  id: string;
  brand: string;
  model: string;
  variant: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  price: number;
}

/** Groups all variants of a model for the variant picker */
export interface ModelVariantGroup {
  brand: string;
  model: string;
  variants: VariantSummary[];
}
