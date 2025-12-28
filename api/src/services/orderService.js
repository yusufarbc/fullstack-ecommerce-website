/**
 * Service for handling Order business logic including checkout and payment processing.
 */
export class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param {import('../repositories/orderRepository.js').OrderRepository} orderRepository - The order repository.
     * @param {import('./productService.js').ProductService} productService - The product service (to validate prices).
     * @param {import('./iyzicoService.js').IyzicoService} iyzicoService - The payment gateway service.
     * @param {import('./emailService.js').EmailService} emailService - The email notification service.
     */
    constructor(orderRepository, productService, iyzicoService, emailService) {
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.iyzicoService = iyzicoService;
        this.emailService = emailService;
    }

    /**
     * Processes a checkout request.
     * @param {Object} checkoutData - The checkout data containing items, guestInfo, and paymentInfo.
     * @returns {Promise<Object>} The result of the checkout process.
     */
    async processCheckout(checkoutData) {
        const { items, guestInfo } = checkoutData;

        // 1. Calculate and Validate Total
        let totalAmount = 0;
        const indexItems = []; // For Prisma
        const iyzicoItems = []; // For Iyzico

        // Validate items and calculate total
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (product) {
                totalAmount += Number(product.price) * item.quantity;

                // Data for Database (Prisma)
                indexItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                });

                // Data for Iyzico
                iyzicoItems.push({
                    id: product.id,
                    name: product.name,
                    category: product.category ? product.category.name : 'General',
                    price: product.price,
                    quantity: item.quantity
                });
            }
        }

        // 2. Create Pending Order
        const orderData = {
            totalAmount,
            status: 'PENDING',
            guestName: guestInfo.name,
            guestEmail: guestInfo.email,
            address: guestInfo.address,
            city: guestInfo.city,
            zipCode: guestInfo.zipCode,
            items: {
                create: indexItems
            }
        };

        const order = await this.orderRepository.createOrder(orderData);

        // 3. Process Payment via Iyzico
        try {
            const paymentResult = await this.iyzicoService.startPaymentProcess(order, iyzicoItems, guestInfo);

            // Return the payment page URL for client redirect
            return {
                status: 'success',
                paymentPageUrl: paymentResult.paymentPageUrl,
                token: paymentResult.token,
                orderId: order.id
            };
        } catch (error) {
            console.error('Iyzico Payment Start Error:', error);
            // Optionally update order status to FAILED here
            return { status: 'failure', errorMessage: 'Payment initialization failed' };
        }
    }

    /**
     * Completes the payment process after successful callback.
     * @param {string} token - The payment token from Iyzico.
     * @returns {Promise<Object>} The result of the payment completion.
     */
    async completePayment(token) {
        try {
            // 1. Verify Payment with Iyzico
            const result = await this.iyzicoService.retrievePaymentResult(token);

            if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
                // 2. Find Order (using conversationId which we set as orderId, or paymentId)
                // Note: iyzicoService.js sets conversationId = order.id
                // But retrievePaymentResult returns rawResult.conversationId

                // Let's assume we can trust the token verification to mean the payment is done.
                // We need the Order ID.
                const orderId = parseInt(result.rawResult.conversationId);

                // 3. Update Order to Success
                await this.orderRepository.updateStatus(orderId, 'SUCCESS', 'COMPLETED');

                // 4. Retrieve Order details for email (or just use what we have if we fetch it)
                // For simplicity, we might need to fetch the order again to get guest details.
                const order = await this.orderRepository.getOrderById(orderId);

                if (order) {
                    await this.emailService.sendOrderConfirmation(order.guestEmail, order.guestName, {
                        id: order.id,
                        total: order.totalAmount,
                        items: order.items // This might require include: items
                    });
                }

                return { status: 'success', orderId: orderId };
            } else {
                return { status: 'failure', errorMessage: 'Payment not successful' };
            }
        } catch (error) {
            console.error('Payment Completion Error:', error);
            throw error;
        }
    }
}
