import mongoose, { Schema, models, model, Document } from "mongoose";

export interface LeadDocument extends Document {
  carId?: string;
  carName?: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  message?: string;
  intent: "buy" | "test_drive" | "loan" | "insurance" | "general";
  status: "new" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<LeadDocument>(
  {
    carId: { type: String },
    carName: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    city: { type: String, required: true },
    message: { type: String },
    intent: {
      type: String,
      enum: ["buy", "test_drive", "loan", "insurance", "general"],
      default: "buy",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const LeadModel =
  (models.Lead as mongoose.Model<LeadDocument>) ?? model<LeadDocument>("Lead", LeadSchema);
