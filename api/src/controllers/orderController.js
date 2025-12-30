import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for handling Siparis HTTP requests.
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

    /**
     * Retrieves an order by ID.
     */
    getOrderById = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const { email } = req.query;

        try {
            const order = await this.orderService.getOrderById(id, email);
            if (!order) {
                return res.status(404).json({ message: 'Sipariş bulunamadı' });
            }
            res.json(order);
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    });

    /**
     * Tracks an order using a secure token.
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    trackOrder = asyncHandler(async (req, res, next) => {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Takip kodu eksik.' });
        }

        const order = await this.orderService.getOrderByTrackingToken(token);

        if (!order) {
            return res.status(404).json({ status: 'failure', errorMessage: 'Sipariş bulunamadı.' });
        }

        res.json({
            status: 'success',
            data: {
                orderNumber: order.siparisNumarasi,
                status: order.durum,
                totalAmount: order.toplamTutar,
                items: order.kalemler,
                createdAt: order.olusturulmaTarihi,
                shippingAddress: {
                    city: order.sehir,
                    district: order.ilce
                }
            }
        });
    });

    /**
     * Cancels an order.
     */
    cancelOrder = asyncHandler(async (req, res, next) => {
        const { token, reason } = req.body;

        if (!token) {
            return res.status(400).json({ status: 'failure', errorMessage: 'Takip kodu (token) gereklidir.' });
        }

        try {
            const result = await this.orderService.cancelOrder(token, reason);
            res.json(result);
        } catch (error) {
            return res.status(400).json({ status: 'failure', errorMessage: error.message });
        }
    });
}
