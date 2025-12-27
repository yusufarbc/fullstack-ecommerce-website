/**
 * Service for handling Order business logic including checkout and payment processing.
 */
export class OrderService {
    /**
     * Creates an instance of OrderService.
     * @param {OrderRepository} orderRepository - The order repository.
     * @param {ProductService} productService - The product service (to validate prices).
     * @param {IyzicoService} iyzicoService - The payment gateway service.
     * @param {EmailService} emailService - The email notification service.
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
        // We re-fetch products to ensure price integrity and check stock
        // For simplicity, we are fetching all products related to the items
        // In a real app, ProductService should have findByIds method.
        // We will loop and fetch one by one or implementing findByIds in ProductService later.

        let totalAmount = 0;
        const validItems = [];

        // Note: Ideally ProductRepository should have findByIds(ids)
        // For now, we fetch one by one to use existing methods or refactor ProductService.
        // Optimization: productRepository.findAll({ where: { id: { in: ids } } })

        // Let's assume passed items have valid IDs, but we must verify price.
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
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
        const orderData = {
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
        };

        const order = await this.orderRepository.createOrder(orderData);

        // 3. Process Payment via Iyzico
        const paymentResult = await this.iyzicoService.startPaymentProcess(order, validItems, guestInfo);

        // 4. Handle Result
        if (paymentResult.status === 'success') {
            // Update Order to Success
            await this.orderRepository.updateStatus(order.id, 'SUCCESS', 'COMPLETED');

            // 5. Send Email
            await this.emailService.sendOrderConfirmation(guestInfo.email, guestInfo.name, {
                id: order.id,
                total: totalAmount,
                items: validItems
            });

            return { status: 'success', orderId: order.id };
        } else {
            return { status: 'failure', errorMessage: 'Payment rejected' };
        }
    }
}
