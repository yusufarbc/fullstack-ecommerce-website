import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('--- Testing SMTP Configuration ---');
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`Port: ${process.env.SMTP_PORT}`);
    console.log(`User: ${process.env.SMTP_USER ? 'Set' : 'Not Set'}`);
    console.log(`Pass: ${process.env.SMTP_PASS ? 'Set' : 'Not Set'}`);
    console.log(`Sender: ${process.env.SMTP_SENDER || 'Defaulting to User'}`);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log('Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection Successful!');

        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: `"Test Sender" <${process.env.SMTP_SENDER || process.env.SMTP_USER}>`, // sender address
            to: process.env.SMTP_USER, // list of receivers (self-test)
            subject: "Test Email from Ecommerce App",
            text: "If you receive this, your email configuration is working correctly.",
            html: "<b>If you receive this, your email configuration is working correctly.</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error(error);
    }
}

testEmail();
