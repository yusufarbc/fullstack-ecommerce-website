import { productRepository } from '../repositories/productRepository.js';

export const getAllProducts = async () => {
    return await productRepository.findAllWithCategories();
};

export const getProductById = async (id) => {
    return await productRepository.findById(id);
};
