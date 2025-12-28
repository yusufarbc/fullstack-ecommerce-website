import { z } from 'zod';

export const validateRequest = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Validation Error:', JSON.stringify(error.errors, null, 2)); // LOGGING ADDED
            return res.status(400).json({
                status: 'failure',
                errorMessage: 'Validation Error',
                errors: error.errors
            });
        }
        next(error);
    }
};
