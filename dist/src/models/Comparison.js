"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const comparisonSchema = new mongoose_1.default.Schema({
    cars: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" }],
    result: Object,
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Comparison", comparisonSchema);
//# sourceMappingURL=Comparison.js.map