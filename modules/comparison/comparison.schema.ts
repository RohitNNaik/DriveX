import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ComparisonDocument extends Document {
  carIds: string[]; // MongoDB _ids
  winner?: string;  // car name
  insights: string[];
  table: ComparisonRow[];
  createdAt: Date;
}

export interface ComparisonRow {
  label: string;
  values: (string | number)[];
  winner?: number; // index of winning car
}

const ComparisonSchema = new Schema<ComparisonDocument>(
  {
    carIds: [{ type: Schema.Types.ObjectId, ref: "Car", required: true }],
    winner: { type: String },
    insights: [{ type: String }],
    table: [
      {
        label: String,
        values: [Schema.Types.Mixed],
        winner: Number,
      },
    ],
  },
  { timestamps: true }
);

export const ComparisonModel =
  (models.Comparison as mongoose.Model<ComparisonDocument>) ??
  model<ComparisonDocument>("Comparison", ComparisonSchema);
