/**
 * Controller for handling Order HTTP requests.
 */
export class OrderController {
    /**
     * Creates an instance of OrderController.
     * @param {OrderService} orderService - The order service instance.
     */
    constructor(orderService) {
        this.orderService = orderService;
    }

    /**
     * Handles the checkout process.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    createCheckoutSession = async (req, res) => {
        try {
            const result = await this.orderService.processCheckout(req.body);
            res.json(result);
        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).json({ error: 'Checkout failed' });
        }
    };
}
