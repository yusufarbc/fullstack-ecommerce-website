import { config } from '../config.js';

/**
 * Service for handling Product business logic.
 */
export class ProductService {
    /**
     * Creates an instance of ProductService.
     * @param {import('../repositories/productRepository.js').ProductRepository} productRepository - The product repository instance.
     */
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Formats the product data, ensuring absolute URLs for images.
     * @param {Object} product - The raw product object from DB.
     * @returns {Object} The formatted product.
     */
    _formatProduct(product) {
        if (!product) return null;

        let resimUrl = product.resimUrl;
        if (resimUrl && !resimUrl.startsWith('http') && config.cdnUrl) {
            const baseUrl = config.cdnUrl.endsWith('/') ? config.cdnUrl.slice(0, -1) : config.cdnUrl;
            const path = resimUrl.startsWith('/') ? resimUrl : `/${resimUrl}`;
            resimUrl = `${baseUrl}${path}`;
        }

        return {
            ...product,
            resimUrl
        };
    }

    /**
     * Retrieves all products.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of products.
     */
    async getAllProducts() {
        const products = await this.productRepository.findAllWithCategories();
        return products.map(p => this._formatProduct(p));
    }

    /**
     * Retrieves a single product by its ID.
     * @param {string} id - The ID of the product.
     * @returns {Promise<Object|null>} A promise that resolves to the product object or null if not found.
     */
    async getProductById(id) {
        const product = await this.productRepository.findById(id);
        return this._formatProduct(product);
    }
}
