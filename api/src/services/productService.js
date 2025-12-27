/**
 * Service for handling Product business logic.
 */
export class ProductService {
    /**
     * Creates an instance of ProductService.
     * @param {ProductRepository} productRepository - The product repository instance.
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Retrieves all products.
     * @returns {Promise<Array>} A promise that resolves to an array of products.
     */
    async getAllProducts() {
        return await this.productRepository.findAllWithCategories();
    }

    /**
     * Retrieves a single product by its ID.
     * @param {string} id - The ID of the product.
     * @returns {Promise<Object|null>} A promise that resolves to the product object or null if not found.
     */
    async getProductById(id) {
        return await this.productRepository.findById(id);
    }
}
