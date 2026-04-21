import mongoose, { Schema, Document } from "mongoose";

export interface IScrapedCarPrice extends Document {
  brand: string;
  model: string;
  variant: string;
  price: number;
  currency: string;
  url: string;
  scrapedAt: Date;
  expiresAt?: Date; // TTL index for automatic cleanup
  staticData?: boolean; // Flag to indicate if this is fallback static data
}

const scrapedCarPriceSchema = new Schema<IScrapedCarPrice>(
  {
    brand: {
      type: String,
      required: true,
      lowercase: true,
    },
    model: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    url: {
      type: String,
      required: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days TTL
      index: { expireAfterSeconds: 0 },
    },
    staticData: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
scrapedCarPriceSchema.index({ brand: 1, model: 1, variant: 1, scrapedAt: -1 });

export default mongoose.model<IScrapedCarPrice>(
  "ScrapedCarPrice",
  scrapedCarPriceSchema
);
