import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { Database, Resource } from '@adminjs/prisma';

// Register the adapter
AdminJS.registerAdapter({ Database, Resource });

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

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

    // Build router
    // AdminJSExpress.buildRouter is compatible with ESM
    const adminRouter = AdminJSExpress.buildRouter(admin);
    app.use(admin.options.rootPath, adminRouter);

    console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
};

// Middleware
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for AdminJS compatibility in dev
}));
app.use(express.json());

// Routes
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'UP', timestamp: new Date() });
});

// Start Server
const startServer = async () => {
    await startAdmin();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer().catch(console.error);
