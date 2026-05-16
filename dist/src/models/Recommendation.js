"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const recommendationSchema = new mongoose_1.default.Schema({
    query: String,
    budget: Number,
    preferences: Object,
    resultCars: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" }],
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Recommendation", recommendationSchema);
//# sourceMappingURL=Recommendation.js.map