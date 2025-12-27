/**
 * Controller for handling Product HTTP requests.
 */
export class ProductController {
    /**
     * Creates an instance of ProductController.
     * @param {ProductService} productService - The product service instance.
     */
    constructor(productService) {
        this.productService = productService;
    }

    /**
     * Handles the request to get all products.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    getProducts = async (req, res) => {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    /**
     * Handles the request to get a single product by ID.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    getProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);

            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
