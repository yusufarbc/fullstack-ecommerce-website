import AdminJSExpress from '@adminjs/express';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const pgSession = connectPgSimple(session);

/**
 * Configures the authenticated router for AdminJS.
 * 
 * @param {Object} admin - The initialized AdminJS instance.
 * @param {Object} prisma - The Prisma Client instance.
 * @returns {Object} The Express router handling AdminJS routes and authentication.
 */
export const buildAdminRouter = (admin, prisma) => {
    return AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate: async (email, password) => {
            try {
                const user = await prisma.user.findUnique({ where: { email } });
                if (user && user.role === 'ADMIN') {
                    const matched = await bcrypt.compare(password, user.password);
                    if (matched) {
                        return user;
                    }
                }
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
