import { BaseRepository } from './baseRepository.js';

/**
 * Repository for handling Kategori data interactions.
 * Extends BaseRepository for common CRUD operations.
 */
export class CategoryRepository extends BaseRepository {
    /**
     * Creates an instance of CategoryRepository.
     * @param {import('@prisma/client').PrismaClient} dbClient - The database client (PrismaClient).
     */
    constructor(dbClient) {
        super(dbClient.kategori);
    }
}
