/**
 * Controller for handling Category HTTP requests.
 */
export class CategoryController {
    /**
     * Creates an instance of CategoryController.
     * @param {CategoryService} categoryService - The category service instance.
     */
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Handles the request to get all categories.
     * @param {Object} req - The Express request object.
     * @param {Object} res - The Express response object.
     */
    getCategories = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
