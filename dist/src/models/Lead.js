"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const leadSchema = new mongoose_1.default.Schema({
    carId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" },
    name: String,
    phone: String,
    city: String,
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("Lead", leadSchema);
//# sourceMappingURL=Lead.js.map