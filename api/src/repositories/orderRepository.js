import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Siparis data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class OrderRepository extends BaseRepository {
    /**
     * Creates an instance of OrderRepository.
     * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.siparis);
        this.prisma = dbClient; // Needed for transactions
    }

    /**
     * Creates a new siparis with associated items.
     * @param {Object} orderData - The siparis data including items.
     * @returns {Promise<Object>} The created siparis.
     */
    async createOrder(orderData) {
        return this.model.create({
            data: orderData
        });
    }

    /**
     * Updates payment status and siparis status.
     * @param {string} id - The siparis ID.
     * @param {string} paymentStatus - The new payment status.
     * @param {string} status - The new siparis status.
     * @returns {Promise<Object>} The updated siparis.
     */
    async updateStatus(id, paymentStatus, status) {
        return this.model.update({
            where: { id },
            data: {
                odemeDurumu: paymentStatus,
                durum: status
            }
        });
    }

    /**
     * Finds a siparis by ID including its items.
     * @param {string} id - Siparis ID.
     * @returns {Promise<Object>} The siparis with items.
     */
    async getOrderById(id) {
        return this.model.findUnique({
            where: { id },
            include: {
                kalemler: {
                    include: {
                        urun: true
                    }
                }
            }
        });
    }

    /**
     * Finalizes siparis: Sets status to PAID and decrements stock.
     * Uses a database transaction to ensure atomicity.
     * @param {string} id - Siparis ID
     * @returns {Promise<Object>} Updated Siparis
     */
    async finalizeOrder(id) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Get Siparis items
            const siparis = await tx.siparis.findUnique({
                where: { id },
                include: { kalemler: true }
            });

            if (!siparis) throw new Error('Order not found');

            // 3. Update Siparis Status
            return tx.siparis.update({
                where: { id },
                data: {
                    durum: 'HAZIRLANIYOR',
                    odemeDurumu: 'SUCCESS',
                    faturaDurumu: 'DUZENLENDI' // Trigger invoice generation flow
                }
            });
        });
    }

    /**
     * Updates the payment token for a siparis.
     * @param {string} id - Siparis ID.
     * @param {string} token - Payment token from Iyzico.
     */
    async updatePaymentToken(id, token) {
        return this.model.update({
            where: { id },
            data: { odemeTokeni: token }
        });
    }

    /**
     * Finds a siparis by its payment token.
     * @param {string} token - Payment token.
     * @returns {Promise<Object>} The siparis.
     */
    async getOrderByPaymentToken(token) {
        return this.model.findUnique({
            where: { odemeTokeni: token },
            include: { kalemler: true }
        });
    }

    async getOrderByTrackingToken(token) {
        return this.model.findUnique({
            where: { takipTokeni: token },
            include: {
                kalemler: {
                    include: {
                        urun: true
                    }
                }
            }
        });
    }

    /**
     * Cancels an order by setting its status to IPTAL_EDILDI.
     * @param {string} id - Siparis ID.
     * @returns {Promise<Object>} The updated siparis.
     */
    async cancelOrder(id) {
        return this.model.update({
            where: { id },
            data: { durum: 'IPTAL_EDILDI' }
        });
    }
}
