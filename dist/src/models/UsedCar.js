"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const usedCarSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("UsedCar", usedCarSchema);
//# sourceMappingURL=UsedCar.js.map