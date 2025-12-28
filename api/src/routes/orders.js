import express from 'express';
import { orderController } from '../container.js';

const router = express.Router();

import { validateRequest } from '../middlewares/validationMiddleware.js';
import { checkoutSchema } from '../validators/orderValidator.js';

router.post('/checkout', validateRequest(checkoutSchema), orderController.createCheckoutSession);
router.get('/track', orderController.trackOrder);
router.get('/:id', orderController.getOrderById);

export default router;
