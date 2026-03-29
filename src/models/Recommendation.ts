import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  query: String,
  budget: Number,
  preferences: Object,
  resultCars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Recommendation", recommendationSchema);
