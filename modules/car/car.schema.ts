import mongoose, { Schema, models, model } from "mongoose";

/**
 * Raw shape of a Car document (NOT extending Mongoose Document to avoid
 * the `model` field conflict with Document.model() method).
 */
export type CarDocumentRaw = {
  name: string;
  brand: string;
  /** Car model name (e.g. "Brezza") — renamed to carModel in schema key to avoid conflicts */
  model: string;
  year: number;
  price: number;
  image: string;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
  transmission: "Manual" | "Automatic";
  bodyType: "SUV" | "Sedan" | "Hatchback" | "MPV" | "Coupe";
  mileage: number;
  seating: number;
  engineCC: number;
  power: number;
  torque: number;
  airbags: number;
  rating: number;
  pros: string[];
  cons: string[];
  tags: string[];
  isUsed: boolean;
  kmDriven?: number;
  owners?: number;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Alias for backwards compat
export type CarDocument = CarDocumentRaw;

const CarSchema = new Schema<CarDocument>(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true, index: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true, index: true },
    image: { type: String, default: "" },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      required: true,
      index: true,
    },
    transmission: {
      type: String,
      enum: ["Manual", "Automatic"],
      required: true,
    },
    bodyType: {
      type: String,
      enum: ["SUV", "Sedan", "Hatchback", "MPV", "Coupe"],
      required: true,
      index: true,
    },
    mileage: { type: Number, required: true },
    seating: { type: Number, required: true },
    engineCC: { type: Number, required: true },
    power: { type: Number, required: true },
    torque: { type: Number, required: true },
    airbags: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 5, required: true },
    pros: [{ type: String }],
    cons: [{ type: String }],
    tags: [{ type: String }],
    isUsed: { type: Boolean, default: false, index: true },
    kmDriven: { type: Number },
    owners: { type: Number },
    city: { type: String },
  },
  { timestamps: true }
);

// Prevent Mongoose OverwriteModelError in Next.js hot-reload
export const CarModel =
  (models.Car as mongoose.Model<CarDocumentRaw>) ?? model<CarDocumentRaw>("Car", CarSchema);
