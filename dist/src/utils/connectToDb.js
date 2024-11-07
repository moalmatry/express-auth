"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const connectToDb = async () => {
    const dbUrl = config_1.default.get("dbUrl");
    try {
        await mongoose_1.default.connect(dbUrl);
        logger_1.default.info("Connected to database");
    }
    catch (error) {
        process.exit(1);
    }
};
exports.default = connectToDb;
