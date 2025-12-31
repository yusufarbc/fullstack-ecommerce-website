import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkToken() {
    const token = 'ff8ba3ce-ce48-4e87-b687-d29d6bdb65a1';
    console.log(`Checking token: ${token}`);

    try {
        const order = await prisma.order.findUnique({
            where: { trackingToken: token }
        });

        if (order) {
            console.log('SUCCESS: Order found!');
            console.log('Order Number:', order.orderNumber);
        } else {
            console.log('FAILURE: Order NOT found with this token.');
            // List all tokens to see what we have
            const allOrders = await prisma.order.findMany({
                select: { orderNumber: true, trackingToken: true }
            });
            console.log('Available Orders:', allOrders);
        }
    } catch (e) {
        console.error('Error querying DB:', e);
    } finally {
        await prisma.$disconnect();
    }
}

checkToken();
