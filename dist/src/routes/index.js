"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scraper_routes_1 = __importDefault(require("./scraper.routes"));
const router = (0, express_1.Router)();
// Register route modules
router.use("/scraped-prices", scraper_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map