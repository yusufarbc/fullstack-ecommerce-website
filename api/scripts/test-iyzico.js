
import { IyzicoService } from '../src/services/iyzicoService.js';
import dotenv from 'dotenv';
dotenv.config();

async function testIyzico() {
    console.log('--- Starting Iyzico Manual Test ---');

    const config = {
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        baseUrl: process.env.IYZICO_BASE_URL
    };

    if (!config.apiKey || config.apiKey === 'your_api_key') {
        console.error('ERROR: Missing IYZICO_API_KEY in .env file.');
        process.exit(1);
    }

    const service = new IyzicoService(config);

    const mockOrder = {
        id: Math.floor(Math.random() * 10000),
        totalPrice: '10.0'
    };

    const mockBasket = [
        { id: 'BI101', name: 'Test Product', category: 'Electronics', price: '10.0' }
    ];

    const mockBuyer = {
        id: 'user1',
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        identityNumber: '11111111111',
        address: 'Test Address',
        city: 'Istanbul',
        country: 'Turkey',
        ip: '127.0.0.1'
    };

    try {
        console.log('Creating Payment Request...');
        const result = await service.startPaymentProcess(mockOrder, mockBasket, mockBuyer);
        console.log('SUCCESS!');
        console.log('Payment URL:', result.paymentPageUrl);
        console.log('Token:', result.token);
        console.log('-----------------------------------');
        console.log('Please open the URL above in your browser to test the payment page.');
    } catch (error) {
        console.error('FAILED:', error.message);
        if (error.response) console.error(error.response);
    }
}

testIyzico();
