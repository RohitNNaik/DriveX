import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: String,
  price: Number,
  engine: String,
  fuel: String,
  mileage: Number,
  transmission: String
});

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true },
  bodyType: String,
  fuelType: String,
  transmission: String,

  variants: [variantSchema],

  features: [String],
  images: [String],

  rating: Number,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Car", carSchema);
