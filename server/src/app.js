import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';
import { config } from './config.js';
import prisma from './prisma.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';

// Register the adapter
AdminJS.registerAdapter({ Database, Resource });

const app = express();

// AdminJS Configuration
const startAdmin = async () => {
    const admin = new AdminJS({
        resources: [
            { resource: { model: prisma.user, client: prisma }, options: {} },
            { resource: { model: prisma.product, client: prisma }, options: {} },
            { resource: { model: prisma.order, client: prisma }, options: {} },
        ],
        rootPath: '/admin',
    });

    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    console.log(`AdminJS started on http://localhost:${config.port}${admin.options.rootPath}`);
};

// Middleware
app.use(cors({
    origin: config.corsOrigin
}));
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for AdminJS compatibility
}));
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

// Start Server
const startServer = async () => {
    await startAdmin();

    app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};

startServer().catch(console.error);
