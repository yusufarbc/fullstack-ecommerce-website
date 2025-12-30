import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const token = '70338bdf-7ff5-46f7-b177-61b1c9ca88f6';
    const order = await prisma.siparis.findUnique({
        where: { takipTokeni: token },
        include: {
            kalemler: {
                include: { urun: true }
            }
        }
    });
    console.log(JSON.stringify(order, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
