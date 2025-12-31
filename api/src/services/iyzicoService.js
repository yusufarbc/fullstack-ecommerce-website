import Iyzipay from 'iyzipay';

/**
 * Service to handle Iyzico payment gateway integrations.
 * Adheres to SRP by handling only payment interactions.
 */
export class IyzicoService {
    /**
     * Initializes the Iyzico client with API credentials.
     * @param {Object} config - Configuration object containing apiKey, secretKey, and baseUrl.
     */
    constructor(config) {
        this.config = config;
        this.iyzipay = new Iyzipay({
            apiKey: config.apiKey,
            secretKey: config.secretKey,
            uri: config.baseUrl || 'https://sandbox-api.iyzipay.com'
        });
    }

    /**
     * Creates a payment session or initializes a checkout form.
     * 
     * @param {import('@prisma/client').Siparis} order - The order details.
     * @param {Array<Object>} basketItems - List of items in the basket.
     * @param {Object} buyer - Buyer information.
     */
    async startPaymentProcess(order, basketItems, buyer) {
        console.log('Starting Iyzico payment for order:', order.id);

        const request = {
            locale: Iyzipay.LOCALE.TR,
            conversationId: order.id.toString(),
            price: order.toplamTutar.toString(), // Ensure string format
            paidPrice: order.toplamTutar.toString(),
            currency: Iyzipay.CURRENCY.TRY,
            basketId: order.id.toString(),
            paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
            callbackUrl: `${process.env.API_URL || 'http://localhost:8080'}/api/v1/payment/callback`,
            enabledInstallments: [1, 2, 3, 6, 9],
            buyer: {
                id: buyer.id || 'guest',
                name: buyer.name || 'Guest',
                surname: buyer.surname || 'User',
                gsmNumber: buyer.phone || '+905555555555',
                email: buyer.email || 'guest@example.com',
                identityNumber: '11111111111',
                lastLoginDate: '2023-01-01 00:00:00',
                registrationDate: '2023-01-01 00:00:00',
                registrationAddress: buyer.address || 'Istanbul',
                ip: buyer.ip || '85.85.85.85',
                city: buyer.city || 'Istanbul',
                country: buyer.country || 'Turkey',
                zipCode: buyer.zipCode || '34732'
            },
            shippingAddress: {
                contactName: buyer.name + ' ' + buyer.surname,
                city: buyer.city,
                country: buyer.country,
                address: buyer.address,
                district: buyer.district,
                zipCode: buyer.zipCode
            },
            billingAddress: {
                contactName: buyer.name + ' ' + buyer.surname,
                city: buyer.city,
                country: buyer.country,
                address: buyer.address,
                district: buyer.district,
                zipCode: buyer.zipCode
            },
            basketItems: basketItems.flatMap(item => {
                const items = [];
                for (let i = 0; i < item.quantity; i++) {
                    items.push({
                        id: item.id.toString(),
                        name: item.name,
                        category1: item.category || 'General',
                        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                        price: item.price.toString()
                    });
                }
                return items;
            })
        };

        return new Promise((resolve, reject) => {
            this.iyzipay.checkoutFormInitialize.create(request, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.status !== 'success') {
                    return reject(new Error(`Iyzico Error: ${result.errorMessage}`));
                }
                resolve({
                    status: 'success',
                    paymentPageUrl: result.paymentPageUrl,
                    token: result.token
                });
            });
        });
    }

    /**
     * Verifies the payment result using the token returned by Iyzico.
     * 
     * @param {string} token - The payment token received from the callback.
     * @returns {Promise<Object>} - The verified payment result.
     */
    async retrievePaymentResult(token) {
        console.log('Retrieving Iyzico result for token:', token);

        return new Promise((resolve, reject) => {
            this.iyzipay.checkoutForm.retrieve({
                locale: Iyzipay.LOCALE.TR,
                token: token
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.status !== 'success') {
                    return reject(new Error(`Iyzico Verification Error: ${result.errorMessage}`));
                }

                resolve({
                    status: 'success',
                    paymentStatus: result.paymentStatus,
                    paymentId: result.paymentId,
                    paidPrice: result.paidPrice,
                    rawResult: result
                });
            });
        });
    }
    /**
     * Cancels a payment transaction.
     * @param {string} paymentId - The Iyzico payment ID.
     * @param {string} reason - Cancellation reason.
     * @returns {Promise<Object>} Cancellation result.
     */
    async cancelPayment(paymentId, reason) {
        console.log(`Cancelling payment ${paymentId} with reason: ${reason}`);

        return new Promise((resolve, reject) => {
            this.iyzipay.cancel.create({
                locale: Iyzipay.LOCALE.TR,
                conversationId: paymentId,
                paymentId: paymentId,
                ip: '127.0.0.1'
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (result.status !== 'success') {
                    return reject(new Error(`Iyzico Cancel Error: ${result.errorMessage}`));
                }

                resolve({
                    status: 'success',
                    price: result.price,
                    currency: result.currency
                });
            });
        });
    }
}
