import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@siten.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    console.log('🌱 Starting database seeding...');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (existingAdmin) {
        console.log(`✅ Admin user already exists: ${adminEmail}`);
        return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            fullName: 'System Administrator',
            role: 'ADMIN',
        },
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`📧 Email: ${admin.email}`);
    console.log(`👤 Name: ${admin.fullName}`);
    console.log(`🔑 Role: ${admin.role}`);
    console.log(`⚠️  Password: ${adminPassword} (Change this in production!)`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
