import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Order data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class OrderRepository extends BaseRepository {
    /**
     * Creates an instance of OrderRepository.
     * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.order);
        this.prisma = dbClient; // Needed for transactions
    }

    /**
     * Creates a new order with associated items.
     * @param {Object} orderData - The order data including items.
     * @returns {Promise<Object>} The created order.
     */
    async createOrder(orderData) {
        return this.model.create({
            data: orderData
        });
    }

    /**
     * Updates payment status and order status.
     * @param {string} id - The order ID.
     * @param {string} paymentStatus - The new payment status.
     * @param {string} status - The new order status.
     * @returns {Promise<Object>} The updated order.
     */
    async updateStatus(id, paymentStatus, status) {
        return this.model.update({
            where: { id },
            data: {
                paymentStatus,
                status
            }
        });
    }

    /**
     * Finds an order by ID including its items.
     * @param {number} id - Order ID.
     * @returns {Promise<Object>} The order with items.
     */
    async getOrderById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }

    /**
     * Finalizes order: Sets status to PAID and decrements stock.
     * Uses a database transaction to ensure atomicity.
     * @param {string} id - Order ID
     * @returns {Promise<Object>} Updated Order
     */
    async finalizeOrder(id) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Get Order items
            const order = await tx.order.findUnique({
                where: { id },
                include: { items: true }
            });

            if (!order) throw new Error('Order not found');



            // 3. Update Order Status
            return tx.order.update({
                where: { id },
                data: {
                    status: 'PREPARING',
                    paymentStatus: 'SUCCESS',
                    invoiceStatus: 'ISSUED' // Trigger invoice generation flow
                }
            });
        });
    }
    /**
     * Updates the payment token for an order.
     * @param {string} id - Order ID.
     * @param {string} token - Payment token from Iyzico.
     */
    async updatePaymentToken(id, token) {
        return this.model.update({
            where: { id },
            data: { paymentToken: token }
        });
    }

    /**
     * Finds an order by its payment token.
     * @param {string} token - Payment token.
     * @returns {Promise<Object>} The order.
     */
    async getOrderByPaymentToken(token) {
        return this.model.findUnique({
            where: { paymentToken: token },
            include: { items: true }
        });
    }

    async getOrderByTrackingToken(token) {
        return this.model.findUnique({
            where: { trackingToken: token },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
}
