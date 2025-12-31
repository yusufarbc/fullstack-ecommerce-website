import nodemailer from 'nodemailer';
import { config } from '../config.js';

/**
 * Service to handle Email notifications via standard SMTP (e.g., Brevo).
 */
export class EmailService {
    /**
     * Initializes the Email service with SMTP transport.
     * @param {Object} smtpConfig - SMTP Configuration object.
     */
    constructor(smtpConfig) {
        this.transporter = nodemailer.createTransport({
            host: smtpConfig.host,
            port: smtpConfig.port,
            secure: false, // true for 465, false for other ports
            auth: {
                user: smtpConfig.user,
                pass: smtpConfig.pass,
            },
        });
    }

    /**
     * Sends an Order Confirmation email to the customer.
     * 
     * @param {string} toEmail - Recipient email address.
     * @param {string} toName - Recipient name.
     * @param {Object} orderDetails - Object containing order summary.
     * @returns {Promise<void>}
     */
    async sendOrderConfirmation(toEmail, toName, orderDetails) {
        console.log(`Sending Order Confirmation to ${toEmail} for Order ${orderDetails.id}`);

        // Use Secure Tracking Link
        const orderLink = `${config.clientUrl}/siparis-takip?token=${orderDetails.trackingToken}`;

        const htmlContent = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h1 style="color: #2563eb;">Siparişiniz İçin Teşekkür Ederiz, ${toName}!</h1>
                        <p>Siparişiniz başarıyla alındı ve hazırlanıyor.</p>
                        
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>Sipariş No:</strong> #${orderDetails.orderNumber}</p>
                            <p style="margin: 5px 0;"><strong>Toplam Tutar:</strong> ₺${Number(orderDetails.total).toFixed(2)}</p>
                        </div>

                        <p>Siparişinizin detaylarını, kargo takibini ve faturanızı görüntülemek için aşağıdaki butona tıklayın:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${orderLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Siparişimi Görüntüle</a>
                        </div>
                        
                        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 30px;">
                            Bu e-posta otomatik olarak oluşturulmuştur. Lütfen yanıtlamayınız.<br>
                            Sorularınız için bizimle iletişime geçebilirsiniz.
                        </p>
                    </div>
                </body>
            </html>
        `;

        const mailOptions = {
            from: `"E-Commerce Mağazası" <${config.brevo.smtp.sender}>`, // Sender address
            to: toEmail, // List of receivers
            subject: `Siparişiniz Onaylandı - #${orderDetails.orderNumber}`, // Subject line
            html: htmlContent, // html body
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully via SMTP. MessageId: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email via SMTP:', error);
            // Don't throw to prevent blocking the order completion
        }
    }
}
