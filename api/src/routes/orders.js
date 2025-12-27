import express from 'express';
import { orderController } from '../container.js';

const router = express.Router();

router.post('/checkout', orderController.createCheckoutSession);

export default router;
