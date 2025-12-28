import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { getAdminResources } from './src/config/resources.js';
import { buildAdminRouter } from './src/config/auth.js';

dotenv.config();

/**
 * Main application entry point for the Admin Service.
 * Follows SOLID principles by delegating configuration to specialized modules.
 */
const start = async () => {
    console.log("Starting Admin Service...");

    const app = express();
    app.use(cors());

    // 1. Database & Adapter Registration
    const prisma = new PrismaClient();
    AdminJS.registerAdapter({ Database, Resource });

    // 2. AdminJS Configuration
    const adminOptions = {
        resources: getAdminResources(prisma),
        rootPath: '/admin',
        branding: {
            companyName: 'Store Admin',
            logo: false, // Or path to logo
        }
    };
    const admin = new AdminJS(adminOptions);

    // 3. Router Construction (Auth + AdminJS)
    const adminRouter = buildAdminRouter(admin, prisma);
    app.use(admin.options.rootPath, adminRouter);

    // 4. Server Listen
    app.get('/', (req, res) => {
        res.redirect(admin.options.rootPath);
    });

    const PORT = process.env.PORT || 8081;
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
};

start().catch(e => {
    console.error("AdminJS Startup Failed:", e);
    process.exit(1);
});
