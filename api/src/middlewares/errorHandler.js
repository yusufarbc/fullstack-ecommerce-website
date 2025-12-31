import { config } from '../config.js';

/**
 * Global Error Handler Middleware.
 * Captures all errors forwarded by next(err).
 * 
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        stack: config.nodeEnv === 'development' ? err.stack : undefined
    });
};
