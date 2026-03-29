import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema({
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  result: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Comparison", comparisonSchema);
