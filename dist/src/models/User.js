"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    phone: String,
    savedCars: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Car" }],
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map