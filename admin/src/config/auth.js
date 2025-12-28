import AdminJSExpress from '@adminjs/express';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const pgSession = connectPgSimple(session);

/**
 * Configures the authenticated router for AdminJS.
 * 
 * @param {import('adminjs').default} admin - The initialized AdminJS instance.
 * @param {import('@prisma/client').PrismaClient} prisma - The Prisma Client instance.
 * @returns {import('express').Router} The Express router handling AdminJS routes and authentication.
 */
export const buildAdminRouter = (admin, prisma) => {
    return AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, password) => {
            try {
                console.log(`Attempting login for: ${email}`);

                // Hardcoded Env Auth (No DB User Table)
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (email === adminEmail) {
                    // In a real app we might hash the env var too, but for simplicity/request:
                    // Check if password matches (assuming Env is plain text or we compare plain)
                    // If the user wants bcrypt compare, the Env should store the hash.
                    // But typically 'hardcoded' means plain text check for simple apps.
                    // Let's assume plain text check since docker-compose has 'Admin123!'

                    if (password === adminPassword) {
                        return { email: adminEmail, role: 'ADMIN' };
                    }
                }

                return false;
                return false;
            } catch (error) {
                console.error("Authentication Error:", error);
                return false;
            }
        },
        cookieName: 'adminjs',
        cookiePassword: process.env.COOKIE_PASSWORD || 'secure-cookie-password-must-be-32-chars-long',
    }, null, {
        store: new pgSession({
            conObject: {
                connectionString: process.env.DATABASE_URL,
            },
            createTableIfMissing: true, // Be careful with this in production, better to use migrations
        }),
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || 'super_secret_session_key',
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 // 1 Day
        }
    });
};
