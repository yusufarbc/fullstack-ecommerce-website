import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Urun data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class ProductRepository extends BaseRepository {
    /**
     * Creates an instance of ProductRepository.
     * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.urun);
    }

    /**
     * Retrieves all products including their associated category.
     * @returns {Promise<Array<import('@prisma/client').Urun & { kategori: import('@prisma/client').Kategori }>>} A promise that resolves to an array of products with categories.
     */
    async findAllWithCategories() {
        return this.findAll({
            include: {
                kategori: true
            },
            orderBy: { olusturulmaTarihi: 'desc' }
        });
    }
}
