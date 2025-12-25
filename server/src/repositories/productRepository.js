import prisma from '../prisma.js';
import { BaseRepository } from './baseRepository.js';

class ProductRepository extends BaseRepository {
    constructor() {
        super(prisma.product);
    }

    async findAllWithCategories() {
        return this.findAll({
            include: {
                category: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    // Example of a custom query specific to products
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

export const productRepository = new ProductRepository();
