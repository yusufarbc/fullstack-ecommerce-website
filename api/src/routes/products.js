import express from 'express';
import { productController } from '../container.js';

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

export default router;
