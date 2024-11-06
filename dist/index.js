"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
app.use("/api/users", users_1.default);
const PORT = 3000;
app.get("/api/users", (request, response, next) => { });
app.listen(PORT, () => {
    console.log("Running on port: ", PORT);
});
