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
        // In real implementation: 
        // this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        // this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    }

    /**
     * Sends an Order Confirmation email to the customer.
     * 
     * @param {string} toEmail - Recipient email address.
     * @param {string} toName - Recipient name.
     * @param {Object} orderDetails - Object containing order summary (ID, total, items).
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

export const emailService = new EmailService(process.env.BREVO_API_KEY);
