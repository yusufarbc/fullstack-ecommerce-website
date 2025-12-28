import crypto from 'crypto';
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
        // Renaming guestInfo to customerInfo for consistency
        const { items, guestInfo: customerInfo } = checkoutData;

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
        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        // Generate Short Order Number (e.g. 738492)
        const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

        // Split Full Name
        const fullNameParts = customerInfo.name.trim().split(' ');
        const surname = fullNameParts.length > 1 ? fullNameParts.pop() : '';
        const name = fullNameParts.join(' ');

        // Format Phone (+90...)
        let rawPhone = customerInfo.phone.replace(/\s/g, ''); // Remove spaces
        if (rawPhone.startsWith('0')) {
            rawPhone = '+90' + rawPhone.substring(1);
        } else if (!rawPhone.startsWith('+')) {
            rawPhone = '+90' + rawPhone; // Assume 5XX... -> +905XX...
        }

        const country = 'Turkey';

        // Generate Secure Tracking Token (UUID)
        const trackingToken = crypto.randomUUID();

        const orderData = {
            totalAmount,
            status: 'PENDING',
            orderNumber: orderNumber,
            trackingToken: trackingToken,
            name: name || customerInfo.name, // Fallback to full name if split fails
            surname: surname,
            email: customerInfo.email,
            phone: rawPhone,
            address: customerInfo.address,
            city: customerInfo.city,
            district: customerInfo.district,
            zipCode: customerInfo.zipCode,
            country: country,
            isCorporate: !!isCorporate,
            companyName: companyName || null,
            taxOffice: taxOffice || null,
            taxNumber: taxNumber || null,
            items: {
                create: indexItems
            }
        };

        const order = await this.orderRepository.createOrder(orderData);

        // 3. Process Payment via Iyzico
        try {
            // Transform customerInfo to Iyzico Buyer format
            const buyer = {
                id: 'customer-' + order.id,
                name: name || 'Guest',
                surname: surname || 'User',
                email: customerInfo.email,
                phone: rawPhone,
                address: customerInfo.address,
                city: customerInfo.city,
                district: customerInfo.district, // Passing district to Iyzico Service
                country: country,
                zipCode: customerInfo.zipCode,
                ip: '127.0.0.1' // In production, get this from request headers
            };

            const paymentResult = await this.iyzicoService.startPaymentProcess(order, iyzicoItems, buyer);

            // Save the token to the order for robust callback handling
            await this.orderRepository.updatePaymentToken(order.id, paymentResult.token);

            // Save the token to the order for robust callback handling
            if (paymentResult.token) {
                await this.orderRepository.updatePaymentToken(order.id, paymentResult.token);
            }

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
                // 2. Find Order using the Payment Token (Most Robust Way)
                console.log('Completing payment for Token:', token);

                let order = await this.orderRepository.getOrderByPaymentToken(token);
                console.log('DEBUG: Order found by token:', order ? { id: order.id, orderNumber: order.orderNumber } : 'null');

                if (!order) {
                    // Fallback to conversationId if token lookup fails (legacy support or race condition)
                    const fallbackId = result.rawResult.conversationId;
                    console.log('Token lookup failed, trying conversationId:', fallbackId);
                    if (fallbackId) {
                        order = await this.orderRepository.getOrderById(fallbackId);
                    }
                }

                if (!order) {
                    throw new Error('Order not found for the given payment token');
                }

                // 3. Finalize Order (Transaction: Deduct Stock, Update Status)
                await this.orderRepository.finalizeOrder(order.id);

                // 4. Retrieve Order details for email (Refresh data)
                const freshOrder = await this.orderRepository.getOrderById(order.id);

                if (freshOrder) {
                    await this.emailService.sendOrderConfirmation(freshOrder.email, freshOrder.name, {
                        id: freshOrder.id,
                        orderNumber: freshOrder.orderNumber, // Short Code
                        trackingToken: freshOrder.trackingToken, // Secure Token for link
                        total: freshOrder.totalAmount,
                        items: freshOrder.items
                    });
                }

                return { status: 'success', orderId: order.id, orderNumber: order.orderNumber, trackingToken: order.trackingToken };
            } else {
                return { status: 'failure', errorMessage: 'Payment not successful' };
            }
        } catch (error) {
            console.error('Payment Completion Error:', error);
            throw error;
        }
    }

    /**
     * Finds an order by its secure tracking token.
     * @param {string} token - Tracking token.
     * @returns {Promise<Object>} The order.
     */
    async getOrderByTrackingToken(token) {
        return this.orderRepository.getOrderByTrackingToken(token);
    }

    /**
     * Retrieves an order by ID and optionally verifies the email.
     * @param {number} id - Order ID.
     * @param {string} [email] - Guest email to verify.
     * @returns {Promise<Object>} The order object.
     * @throws {Error} If order not found or email mismatch.
     */
    async getOrderById(id, email) {
        const order = await this.orderRepository.getOrderById(id);
        if (!order) return null;

        if (email && order.email !== email) {
            throw new Error('Erişim reddedildi: E-posta adresi eşleşmiyor.');
        }

        return order;
    }
}
