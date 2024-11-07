"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const connectToDb_1 = __importDefault(require("./utils/connectToDb"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use(routes_1.default);
const port = config_1.default.get("port");
app.listen(port, async () => {
    logger_1.default.info(`Listening on port ${port}`);
    (0, connectToDb_1.default)();
});
