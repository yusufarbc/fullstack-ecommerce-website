import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const products = await prisma.urun.findMany({
        select: { ad: true, resimUrl: true }
    });
    console.log(JSON.stringify(products, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
