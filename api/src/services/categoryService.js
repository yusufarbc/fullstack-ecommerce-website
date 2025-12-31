/**
 * Service for handling Category business logic.
 */
export class CategoryService {
    /**
     * Creates an instance of CategoryService.
     * @param {import('../repositories/categoryRepository.js').CategoryRepository} categoryRepository - The category repository instance.
     */
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Retrieves all categories.
     * @returns {Promise<Array<import('@prisma/client').Category>>} A promise that resolves to an array of categories.
     */
    async getAllCategories() {
        return await this.categoryRepository.findAll();
    }
}
