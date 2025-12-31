import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for handling Payment related HTTP requests.
 */
export class PaymentController {
    /**
     * Creates an instance of PaymentController.
     * @param {import('../services/orderService.js').OrderService} orderService - The order service instance.
     */
    constructor(orderService) {
        this.orderService = orderService;
        // Bind methods or use arrow functions to preserve 'this' context if passed as callbacks
    }

    /**
     * Handles the payment callback from Iyzico.
     * This is typically a POST request from the user's browser (redirected by Iyzico).
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    handleCallback = asyncHandler(async (req, res, next) => {
        console.log('Payment Callback Received:', req.body);
        // Iyzico allows POST request for callback
        // Token typically comes in body for POST, but checking query just in case
        const token = req.body?.token || req.query?.token;

        if (!token) {
            throw new Error('Token missing in callback');
        }

        const result = await this.orderService.completePayment(token);

        if (result.status === 'success') {
            // Redirect to Frontend Success Page
            const redirectUrl = `${process.env.CLIENT_URL}/payment/success?orderNumber=${result.orderNumber}&trackingToken=${result.trackingToken}`;
            console.log('DEBUG: Redirecting to:', redirectUrl);
            res.redirect(redirectUrl);
        } else {
            res.redirect(`${process.env.CLIENT_URL}/payment/failure?errorMessage=${encodeURIComponent(result.errorMessage)}`);
        }
    });
}
