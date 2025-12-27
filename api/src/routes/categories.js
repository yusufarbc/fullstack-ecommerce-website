import express from 'express';
import { categoryController } from '../container.js';

const router = express.Router();

router.get('/', categoryController.getCategories);

export default router;
