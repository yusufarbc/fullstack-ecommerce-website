import crypto from 'crypto';
/**
 * Service for handling Siparis business logic including checkout and payment processing.
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
        const { items, guestInfo: customerInfo } = checkoutData;

        // 1. Calculate and Validate Total
        let toplamTutar = 0;
        const indexItems = []; // For Prisma
        const iyzicoItems = []; // For Iyzico

        // Validate items and calculate total
        for (const item of items) {
            const product = await this.productService.getProductById(item.id);
            if (product) {
                toplamTutar += Number(product.fiyat) * item.quantity;

                // Data for Database (Prisma)
                indexItems.push({
                    urunId: product.id,
                    adet: item.quantity,
                    fiyat: product.fiyat
                });

                // Data for Iyzico
                iyzicoItems.push({
                    id: product.id,
                    name: product.ad,
                    category: product.kategori ? product.kategori.ad : 'General',
                    price: product.fiyat,
                    quantity: item.quantity
                });
            }
        }

        // 2. Create Pending Siparis
        const { isCorporate, companyName, taxOffice, taxNumber } = checkoutData.invoiceInfo || {};

        // Generate Short Order Number (e.g. 738492)
        const siparisNumarasi = Math.floor(100000 + Math.random() * 900000).toString();

        // Split Full Name
        const fullNameParts = customerInfo.name.trim().split(' ');
        const soyad = fullNameParts.length > 1 ? fullNameParts.pop() : '';
        const ad = fullNameParts.join(' ');

        // Format Phone (+90...)
        let rawPhone = customerInfo.phone.replace(/\s/g, ''); // Remove spaces
        if (rawPhone.startsWith('0')) {
            rawPhone = '+90' + rawPhone.substring(1);
        } else if (!rawPhone.startsWith('+')) {
            rawPhone = '+90' + rawPhone; // Assume 5XX... -> +905XX...
        }

        const ulke = 'Türkiye';

        // Generate Secure Tracking Token (UUID)
        const takipTokeni = crypto.randomUUID();

        const orderData = {
            toplamTutar,
            durum: 'BEKLEMEDE',
            siparisNumarasi: siparisNumarasi,
            takipTokeni: takipTokeni,
            ad: ad || customerInfo.name, // Fallback to full name if split fails
            soyad: soyad,
            eposta: customerInfo.email,
            telefon: rawPhone,
            adres: customerInfo.address,
            sehir: customerInfo.city,
            ilce: customerInfo.district,
            postaKodu: customerInfo.zipCode,
            ulke: ulke,
            kurumsalMi: !!isCorporate,
            sirketAdi: companyName || null,
            vergiDairesi: taxOffice || null,
            vergiNumarasi: taxNumber || null,
            kalemler: {
                create: indexItems
            }
        };

        const siparis = await this.orderRepository.createOrder(orderData);

        // 3. Process Payment via Iyzico
        try {
            // Transform customerInfo to Iyzico Buyer format
            const buyer = {
                id: 'customer-' + siparis.id,
                name: ad || 'Guest',
                surname: soyad || 'User',
                email: customerInfo.email,
                phone: rawPhone,
                address: customerInfo.address,
                city: customerInfo.city,
                district: customerInfo.district,
                country: ulke,
                zipCode: customerInfo.zipCode,
                ip: '127.0.0.1' // In production, get this from request headers
            };

            const paymentResult = await this.iyzicoService.startPaymentProcess(siparis, iyzicoItems, buyer);

            // Save the token to the order for robust callback handling
            if (paymentResult.token) {
                await this.orderRepository.updatePaymentToken(siparis.id, paymentResult.token);
            }

            // Return the payment page URL for client redirect
            return {
                status: 'success',
                paymentPageUrl: paymentResult.paymentPageUrl,
                token: paymentResult.token,
                orderId: siparis.id
            };
        } catch (error) {
            console.error('Iyzico Payment Start Error:', error);
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
                // 2. Find Siparis using the Payment Token
                console.log('Completing payment for Token:', token);

                let siparis = await this.orderRepository.getOrderByPaymentToken(token);

                if (!siparis) {
                    // Fallback to conversationId if token lookup fails
                    const fallbackId = result.rawResult.conversationId;
                    if (fallbackId) {
                        siparis = await this.orderRepository.getOrderById(fallbackId);
                    }
                }

                if (!siparis) {
                    throw new Error('Order not found for the given payment token');
                }

                // 3. Finalize Order
                await this.orderRepository.finalizeOrder(siparis.id);

                // 4. Retrieve Order details for email
                const freshOrder = await this.orderRepository.getOrderById(siparis.id);

                if (freshOrder) {
                    await this.emailService.sendOrderConfirmation(freshOrder.eposta, freshOrder.ad, {
                        id: freshOrder.id,
                        orderNumber: freshOrder.siparisNumarasi,
                        trackingToken: freshOrder.takipTokeni,
                        total: freshOrder.toplamTutar,
                        items: freshOrder.kalemler
                    });
                }

                return { status: 'success', orderId: siparis.id, orderNumber: siparis.siparisNumarasi, trackingToken: siparis.takipTokeni };
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
     * @param {string} id - Siparis ID.
     * @param {string} [email] - Guest email to verify.
     * @returns {Promise<Object>} The order object.
     * @throws {Error} If order not found or email mismatch.
     */
    async getOrderById(id, email) {
        const siparis = await this.orderRepository.getOrderById(id);
        if (!siparis) return null;

        if (email && siparis.eposta !== email) {
            throw new Error('Erişim reddedildi: E-posta adresi eşleşmiyor.');
        }

        return siparis;
    }
}
