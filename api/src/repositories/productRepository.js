import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Product data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class ProductRepository extends BaseRepository {
    /**
     * Creates an instance of ProductRepository.
     * @param {Object} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.product);
    }

    /**
     * Retrieves all products including their associated category.
     * @returns {Promise<Array>} A promise that resolves to an array of products with categories.
     */
    async findAllWithCategories() {
        return this.findAll({
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Finds products with stock level below or equal to a threshold.
     * @param {number} [threshold=10] - The stock threshold.
     * @returns {Promise<Array>} A promise that resolves to an array of products.
     */
    async findByStockLow(threshold = 10) {
        return this.model.findMany({
            where: {
                stock: {
                    lte: threshold
                }
            }
        });
    }
}
