import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 8080,
  corsOrigin: process.env.CORS_ORIGIN || '*',
  nodeEnv: process.env.NODE_ENV || 'development',
  iyzico: {
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    baseUrl: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY, // Keep for backward compat if needed, but we use SMTP now
    smtp: {
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: process.env.SMTP_PORT || 587,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      sender: process.env.SMTP_SENDER || 'no-reply@siten.com',
    }
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};
