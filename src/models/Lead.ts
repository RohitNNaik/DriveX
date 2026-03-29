import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car" },
  name: String,
  phone: String,
  city: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Lead", leadSchema);
