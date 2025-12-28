/**
 * Service to handle Email notifications via Brevo (formerly Sendinblue).
 * Adheres to SRP by handling only email communications.
 */
export class EmailService {
    /**
     * Initializes the Email service.
     * @param {string} apiKey - Brevo API Key.
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Sends an Order Confirmation email to the customer.
     * 
     * @param {string} toEmail - Recipient email address.
     * @param {string} toName - Recipient name.
     * @param {Object} orderDetails - Object containing order summary.
     * @param {number} orderDetails.id - Order ID.
     * @param {number} orderDetails.total - Total amount.
     * @param {Array} [orderDetails.items] - List of items.
     * @returns {Promise<void>}
     */
    async sendOrderConfirmation(toEmail, toName, orderDetails) {
        console.log(`Sending Order Confirmation to ${toEmail} for Order ${orderDetails.id}`);

        // Mock Brevo API call
        // const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        // ... configure email ...
        // await this.apiInstance.sendTransacEmail(sendSmtpEmail);

        return Promise.resolve();
    }
}

// Refactored to pure class export for DI container.
