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
}
