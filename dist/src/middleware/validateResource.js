"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateResource = (schema) => (req, res, next) => {
    try {
        schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        res.status(400).json({ errors: error.errors });
    }
};
exports.default = validateResource;
