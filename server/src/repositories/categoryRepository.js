import prisma from '../prisma.js';
import { BaseRepository } from './baseRepository.js';

class CategoryRepository extends BaseRepository {
    constructor() {
        super(prisma.category);
    }
}

export const categoryRepository = new CategoryRepository();
