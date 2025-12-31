import { getModelByName } from '@adminjs/prisma';
import uploadFeature from '@adminjs/upload';
import { v4 as uuidv4 } from 'uuid';
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
                model: getModelByName('Urun'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'ShoppingBag',
                },
                properties: {
                    ad: { isTitle: true },
                    fiyat: { type: 'number', isRequired: true },
                    desi: { type: 'number', isRequired: true, isVisible: { list: true, show: true, edit: true, filter: true } },
                    resimUrl: {
                        isVisible: false // Hide the raw URL field in forms
                    },
                    imageFile: {
                        isVisible: { list: true, show: true, edit: true, filter: true }
                    },
                    aciklama: { type: 'richtext' },
                    kategoriId: { isVisible: false },
                    kategori: { isVisible: true, isRequired: true },
                    olusturulmaTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } },
                    guncellenmeTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } }
                }
            },
            features: [
                uploadFeature({
                    provider: new R2CustomProvider(),
                    componentLoader,
                    // In version 4 of @adminjs/upload, we use uploadPath
                    uploadPath: (record, filename) => {
                        const ext = filename.split('.').pop();
                        // Even though we convert to webp in provider, we should save as webp in DB
                        return `products/img_${uuidv4()}.webp`;
                    },
                    properties: {
                        key: 'resimUrl', // Map to the database column 'resimUrl'
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
                model: getModelByName('Kategori'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'Folder',
                },
                properties: {
                    ad: { isTitle: true },
                    olusturulmaTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } },
                    guncellenmeTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } }
                }
            }
        },
        {
            resource: {
                model: getModelByName('Siparis'),
                client: prisma
            },
            options: {
                navigation: {
                    name: 'Mağaza Yönetimi',
                    icon: 'ShoppingCart',
                },
                properties: {
                    id: { isVisible: false },
                    toplamTutar: { type: 'currency', props: { symbol: '₺' } },
                    siparisNumarasi: { isTitle: true, isVisible: { list: true, show: true, edit: false, new: false, filter: true } },
                    takipTokeni: { isVisible: { list: false, edit: false, show: true, new: false, filter: false } },
                    odemeId: { isVisible: { list: false, edit: false, show: true, new: false, filter: false } },
                    odemeTokeni: { isVisible: { list: false, edit: false, show: true, new: false, filter: false } },
                    odemeDurumu: { isVisible: { list: true, edit: true, show: true, new: false, filter: true } },
                    kalemler: { isVisible: { list: false, edit: false, show: true, filter: false } },
                    olusturulmaTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } },
                    guncellenmeTarihi: { isVisible: { list: true, show: true, filter: true, edit: false, new: false } }
                }
            }
        },
    ];
};
