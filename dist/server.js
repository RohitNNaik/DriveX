"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./src/app"));
const db_1 = require("./src/config/db");
const scraperScheduler_1 = __importDefault(require("./src/modules/scraperScheduler"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
(0, db_1.connectDB)().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        // Start the scraper scheduler
        scraperScheduler_1.default.start();
    });
});
//# sourceMappingURL=server.js.map