/**
 * Dependency Injection Container.
 * 
 * This module allows for:
 * 1. Centralized configuration of all services and repositories.
 * 2. Easy testing by swapping dependencies (though currently hardwired here).
 * 3. Adherence to Dependency Inversion Principle (DIP).
 */

// Imports
import prisma from './prisma.js';
import { ProductRepository } from './repositories/productRepository.js';
import { CategoryRepository } from './repositories/categoryRepository.js';
import { OrderRepository } from './repositories/orderRepository.js';

import { ProductService } from './services/productService.js';
import { CategoryService } from './services/categoryService.js';
import { OrderService } from './services/orderService.js';
import { IyzicoService } from './services/iyzicoService.js';
import { EmailService } from './services/emailService.js';

import { ProductController } from './controllers/productController.js';
import { CategoryController } from './controllers/categoryController.js';
import { OrderController } from './controllers/orderController.js';
import { PaymentController } from './controllers/paymentController.js';

import { config } from './config.js';

// Configuration
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Repositories
const productRepository = new ProductRepository(prisma);
const categoryRepository = new CategoryRepository(prisma);
const orderRepository = new OrderRepository(prisma);

// Infrastructure Services
const iyzicoService = new IyzicoService(config.iyzico);
const emailService = new EmailService(BREVO_API_KEY);

// Domain Services
const productService = new ProductService(productRepository);
const categoryService = new CategoryService(categoryRepository);
const orderService = new OrderService(orderRepository, productService, iyzicoService, emailService);

// Controllers
const productController = new ProductController(productService);
const categoryController = new CategoryController(categoryService);
const orderController = new OrderController(orderService);
const paymentController = new PaymentController(orderService);

export {
    productController,
    categoryController,
    orderController,
    paymentController
};
