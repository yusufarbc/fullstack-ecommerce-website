import express from 'express';
import { paymentController } from '../container.js';

const router = express.Router();

// Define routes
// The path will be /api/v1/payment/...

router.post('/callback', paymentController.handleCallback);

export default router;
