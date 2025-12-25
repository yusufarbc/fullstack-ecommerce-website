import { categoryRepository } from '../repositories/categoryRepository.js';

export const getAllCategories = async () => {
    return await categoryRepository.findAll();
};
