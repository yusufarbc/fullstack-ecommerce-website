import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Controller for handling Category HTTP requests.
 */
export class CategoryController {
    /**
     * Creates an instance of CategoryController.
     * @param {import('../services/categoryService.js').CategoryService} categoryService - The category service instance.
     */
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Handles the request to get all categories.
     * 
     * @param {import('express').Request} req - The Express request object.
     * @param {import('express').Response} res - The Express response object.
     * @param {import('express').NextFunction} next - The Express next function.
     */
    getCategories = asyncHandler(async (req, res, next) => {
        const categories = await this.categoryService.getAllCategories();
        res.json(categories);
    });
}
