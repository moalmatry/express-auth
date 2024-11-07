"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserHandler = void 0;
const user_service_1 = require("../services/user.service");
// import sendEmail from "../utils/mailer";
const createUserHandler = async (req, res, next) => {
    try {
        const body = req.body;
        const user = await (0, user_service_1.createUser)(body);
        // await sendEmail();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        next(error); // Pass the error to the next middleware (error handler)
    }
};
exports.createUserHandler = createUserHandler;
