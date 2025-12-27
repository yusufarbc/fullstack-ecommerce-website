console.log("Starting imports test...");
try {
    console.log("Importing dotenv");
    await import('dotenv');
    console.log("Importing express");
    await import('express');
    console.log("Importing session");
    await import('express-session');
    console.log("Importing connect-pg-simple");
    await import('connect-pg-simple');
    console.log("Importing bcryptjs");
    await import('bcryptjs');
    console.log("Importing cors");
    await import('cors');

    console.log("Importing AdminJS");
    const AdminJS = await import('adminjs');

    console.log("Importing AdminJSExpress");
    await import('@adminjs/express');

    console.log("Importing Prisma Adapter");
    await import('@adminjs/prisma');

    console.log("Importing PrismaClient");
    await import('@prisma/client');

    console.log("ALL IMPORTS SUCCESSFUL");
} catch (e) {
    console.error("IMPORT FAILED:", e);
}
