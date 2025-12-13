import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSPrisma from '@adminjs/prisma';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Register Prisma adapter for AdminJS
AdminJS.registerAdapter({
    Resource: AdminJSPrisma.Resource,
    Database: AdminJSPrisma.Database,
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for AdminJS
    crossOriginEmbedderPolicy: false,
}));
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// AdminJS Configuration
const adminOptions = {
    resources: [
        {
            resource: { model: prisma.user, client: prisma },
            options: {
                properties: {
                    password: {
                        isVisible: { list: false, filter: false, show: false, edit: true },
                    },
                    createdAt: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                    updatedAt: {
                        isVisible: { list: true, filter: true, show: true, edit: false },
                    },
                },
            },
        },
    ],
    rootPath: '/admin',
    branding: {
        companyName: 'E-Commerce Admin',
        logo: false,
        softwareBrothers: false,
    },
};

const admin = new AdminJS(adminOptions);

// Build and use AdminJS router
const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

// API Routes
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        adminPanel: `http://localhost:${PORT}${admin.options.rootPath}`,
    });
});

// API v1 routes placeholder
app.get('/api/v1', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'E-Commerce API v1',
        version: '1.0.0',
        endpoints: {
            health: '/api/v1/health',
            admin: admin.options.rootPath,
        },
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path,
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/v1/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await prisma.$disconnect();
    process.exit(0);
});

export default app;
