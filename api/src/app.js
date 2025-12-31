import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config.js';
import prisma from './prisma.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';

const app = express();

// Middleware
app.use(cors({
    origin: config.corsOrigin
}));
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for AdminJS compatibility
}));
app.use(compression());
app.use(express.urlencoded({ extended: true })); // Required for Iyzico Callback
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Global Error Handler
import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler);

// Start Server
/**
 * Starts the Express server and initializes connections.
 */
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to Database');

        app.listen(config.port, () => {
            console.log(`API Server running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
