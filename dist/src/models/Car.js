"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const variantSchema = new mongoose_1.default.Schema({
    name: String,
    price: Number,
    engine: String,
    fuel: String,
    mileage: Number,
    transmission: String
});
const carSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Car", carSchema);
//# sourceMappingURL=Car.js.map