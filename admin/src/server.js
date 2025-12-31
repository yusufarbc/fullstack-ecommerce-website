import AdminJS, { ComponentLoader } from 'adminjs';
import { Database, Resource } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { locale } from './config/locale.js';
import { getAdminResources } from './config/resources.js';
import { buildAdminRouter } from './config/auth.js';

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
    const componentLoader = new ComponentLoader();

    const adminOptions = {
        componentLoader,
        resources: getAdminResources(prisma, componentLoader),
        rootPath: '/admin',
        branding: {
            companyName: 'Mağaza Yönetimi',
            logo: false,
        },
        locale: locale
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
