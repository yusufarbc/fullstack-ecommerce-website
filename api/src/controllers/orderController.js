import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for handling Order HTTP requests.
 */
export class OrderController {
    /**
     * Creates an instance of OrderController.
     * @param {import('../services/orderService.js').OrderService} orderService - The order service instance.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Handles the checkout process.
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    createCheckoutSession = asyncHandler(async (req, res, next) => {
        const result = await this.orderService.processCheckout(req.body);
        res.json(result);
    });
}
