import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  savedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
