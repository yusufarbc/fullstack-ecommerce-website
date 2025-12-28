export const locale = {
    language: 'tr',
    translations: {
        actions: {
            new: 'Yeni Oluştur',
            edit: 'Düzenle',
            show: 'Göster',
            delete: 'Sil',
            bulkDelete: 'Toplu Sil',
            list: 'Listele',
            search: 'Ara',
            addNewItem: 'Yeni Öğe Ekle',
        },
        buttons: {
            save: 'Kaydet',
            filter: 'Filtrele',
            login: 'Giriş Yap',
            logout: 'Çıkış',
            create: 'Oluştur',
            confirm: 'Onayla',
            cancel: 'İptal',
            back: 'Geri',
        },
        labels: {
            loginWelcome: 'Yönetim Paneline Hoşgeldiniz',
            Product: 'Ürünler',
            Category: 'Kategoriler',
            Order: 'Siparişler',
            User: 'Kullanıcılar', // Placeholder if model added later
            Navigation: 'Navigasyon',
            Pages: 'Sayfalar',
            Resources: 'Kaynaklar',
            filters: 'Filtreler',
        },
        messages: {
            successfullyCreated: 'Başarıyla oluşturuldu',
            successfullyUpdated: 'Başarıyla güncellendi',
            successfullyDeleted: 'Başarıyla silindi',
            loginWelcome: 'Yönetici hesabınızla giriş yapın',
            errorFetchingRecords: 'Kayıtlar getirilirken hata oluştu',
            forbiddenError: 'Bu işlemi yapmaya yetkiniz yok',
            invalidCredentials: 'E-posta veya şifre hatalı',
        },
        resources: {
            Product: {
                properties: {
                    name: 'Ürün Adı',
                    description: 'Açıklama',
                    price: 'Fiyat (TL)',
                    stock: 'Stok Adedi',
                    imageUrl: 'Görsel URL',
                    categoryId: 'Kategori',
                    createdAt: 'Oluşturulma Tarihi',
                    updatedAt: 'Güncellenme Tarihi',
                }
            },
            Category: {
                properties: {
                    name: 'Kategori Adı',
                    createdAt: 'Oluşturulma Tarihi',
                    updatedAt: 'Güncellenme Tarihi',
                }
            },
            Order: {
                properties: {
                    status: 'Durum',
                    totalAmount: 'Toplam Tutar (TL)',
                    name: 'Müşteri Adı',
                    surname: 'Müşteri Soyadı',
                    email: 'E-Posta',
                    phone: 'Telefon',
                    orderNumber: 'Sipariş No',
                    trackingToken: 'Takip Tokeni (Gizli)',
                    createdAt: 'Sipariş Tarihi',
                    paymentStatus: 'Ödeme Durumu'
                }
            }
        }
    }
};
