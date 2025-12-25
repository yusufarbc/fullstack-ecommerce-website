import prisma from '../prisma.js';
import { iyzicoService } from '../services/iyzicoService.js';
import { emailService } from '../services/emailService.js';

export const createCheckoutSession = async (req, res) => {
    try {
        const { items, guestInfo, paymentInfo } = req.body;

        // 1. Calculate Total (Ideally duplicate logic from cart, ensuring server-side price validation)
        // For prototype, we will trust client prices or re-fetch (best practice is re-fetch)
        // Let's implement a simple re-fetch logic
        const productIds = items.map(item => item.id);
        const dbProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });

        let totalAmount = 0;
        const validItems = [];

        for (const item of items) {
            const product = dbProducts.find(p => p.id === item.id);
            if (product) {
                totalAmount += Number(product.price) * item.quantity;
                validItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });
            }
        }

        // 2. Create Pending Order
        const order = await prisma.order.create({
            data: {
                totalAmount,
                status: 'PENDING',
                guestName: guestInfo.name,
                guestEmail: guestInfo.email,
                address: guestInfo.address,
                city: guestInfo.city,
                zipCode: guestInfo.zipCode,
                items: {
                    create: validItems
                }
            }
        });

        // 3. Process Payment via Iyzico
        const paymentResult = await iyzicoService.startPaymentProcess(order, validItems, guestInfo);

        // 4. Handle Result (Simplified for API flow)
        if (paymentResult.status === 'success') {
            // Update Order to Success
            // In a real world, this happens in Callback or Webhook, or after 3D Secure redirect
            await prisma.order.update({
                where: { id: order.id },
                data: {
                    paymentStatus: 'SUCCESS',
                    status: 'COMPLETED'
                }
            });

            // 5. Send Email
            await emailService.sendOrderConfirmation(guestInfo.email, guestInfo.name, {
                id: order.id,
                total: totalAmount,
                items: validItems
            });

            res.json({ status: 'success', orderId: order.id });
        } else {
            res.json({ status: 'failure', errorMessage: 'Payment rejected' });
        }

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Checkout failed' });
    }
};
