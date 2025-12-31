import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for handling Product HTTP requests.
 */
export class ProductController {
    /**
     * Creates an instance of ProductController.
     * @param {import('../services/productService.js').ProductService} productService - The product service instance.
     */
    constructor(productService) {
        this.productService = productService;
    }

    /**
     * Handles the request to get all products.
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    getProducts = asyncHandler(async (req, res, next) => {
        const products = await this.productService.getAllProducts();
        res.json(products);
    });

    /**
     * Handles the request to get a single product by ID.
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    getProduct = asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const product = await this.productService.getProductById(id);

        if (!product) {
            // Alternatively, one could throw a NotFoundError if custom error classes were defined
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    });
}
