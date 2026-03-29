import mongoose from "mongoose";

const usedCarSchema = new mongoose.Schema({
  title: String,
  brand: String,
  model: String,
  price: Number,
  kmDriven: Number,
  fuelType: String,
  city: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("UsedCar", usedCarSchema);
