import { getModelByName } from '@adminjs/prisma';
import uploadFeature from '@adminjs/upload';
import { R2CustomProvider } from '../utils/r2-provider.js';

/**
 * Defines the AdminJS resources configuration.
 * Maps Prisma models to AdminJS resources with navigation options.
 * 
 * @param {import('@prisma/client').PrismaClient} prisma - The Prisma Client instance.
 * @param {Object} componentLoader - The AdminJS ComponentLoader instance.
 * @returns {Array<import('adminjs').ResourceWithOptions>} List of resource objects for AdminJS.
 */
export const getAdminResources = (prisma, componentLoader) => {
    return [

        {
            resource: {
                model: getModelByName('Product'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'ShoppingBag',
                },
                properties: {
                    // Labels handled by locale, but forcing specific UI behaviors here
                    name: { isTitle: true },
                    price: { type: 'currency', props: { symbol: '₺', decimalSeparator: ',', groupSeparator: '.' } },
                    imageUrl: {
                        isVisible: false // Hide the raw URL field in forms
                    },
                    imageFile: {
                        isVisible: { list: true, show: true, edit: true, filter: true }
                    },
                    description: { type: 'richtext' },

                    categoryId: { isVisible: false },
                    category: { isVisible: true, isRequired: true }
                }
            },
            features: [
                uploadFeature({
                    provider: new R2CustomProvider(),
                    componentLoader,
                    properties: {
                        key: 'imageUrl', // Map to the database column 'imageUrl'
                        file: 'imageFile', // Virtual field for the file input
                    },
                    validation: {
                        mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
                    },
                }),
            ]
        },
        {
            resource: {
                model: getModelByName('Category'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'Folder',
                }
            }
        },
        {
            resource: {
                model: getModelByName('Order'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'ShoppingCart',
                },
                properties: {
                    totalAmount: { type: 'currency', props: { symbol: '₺' } },
                    orderNumber: { isTitle: true },
                    trackingToken: { isVisible: { list: false, edit: false, show: true, filter: false } },
                    items: { isVisible: { list: false, edit: false, show: true, filter: false } }
                }
            }
        },
    ];
};
