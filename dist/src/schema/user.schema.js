"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string({ required_error: "First name is required" }),
        lastName: zod_1.z.string({ required_error: "Last name is required" }),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, "Password is too short - should be min 6 characters"),
        passwordConfirmation: zod_1.z.string({
            required_error: "Please confirm your password",
        }),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email("Not valid email address"),
    })
        .refine((data) => data.password === data.passwordConfirmation, {
        message: "Password don't match",
        path: ["passwordConfirmation"],
    }),
});
