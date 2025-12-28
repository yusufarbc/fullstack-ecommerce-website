import { getModelByName } from '@adminjs/prisma';

/**
 * Defines the AdminJS resources configuration.
 * Maps Prisma models to AdminJS resources with navigation options.
 * 
 * @param {import('@prisma/client').PrismaClient} prisma - The Prisma Client instance.
 * @returns {Array<import('adminjs').ResourceWithOptions>} List of resource objects for AdminJS.
 */
export const getAdminResources = (prisma) => {
    return [
        {
            resource: {
                model: getModelByName('User'),
                client: prisma
            },
            options: {
                navigation: 'User Management',
                // You can add listProperties, filterProperties, editProperties etc. here
            }
        },
        {
            resource: {
                model: getModelByName('Product'),
                client: prisma
            },
            options: {
                navigation: 'Catalog'
            }
        },
        {
            resource: {
                model: getModelByName('Category'),
                client: prisma
            },
            options: {
                navigation: 'Catalog'
            }
        },
        {
            resource: {
                model: getModelByName('Order'),
                client: prisma
            },
            options: {
                navigation: 'Sales'
            }
        },
    ];
};
