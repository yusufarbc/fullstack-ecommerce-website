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
            Urun: 'Ürünler',
            Kategori: 'Kategoriler',
            Siparis: 'Siparişler',
            SiparisKalemi: 'Sipariş Kalemleri',
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
            Urun: {
                properties: {
                    ad: 'Ürün Adı',
                    aciklama: 'Açıklama',
                    fiyat: 'Fiyat (₺)',
                    resimUrl: 'Görsel URL',
                    kategoriId: 'Kategori',
                    kategori: 'Kategori',
                    olusturulmaTarihi: 'Oluşturulma Tarihi',
                    guncellenmeTarihi: 'Güncellenme Tarihi',
                }
            },
            Kategori: {
                properties: {
                    ad: 'Kategori Adı',
                    olusturulmaTarihi: 'Oluşturulma Tarihi',
                    guncellenmeTarihi: 'Güncellenme Tarihi',
                }
            },
            Siparis: {
                properties: {
                    durum: 'Durum',
                    faturaDurumu: 'Fatura Durumu',
                    toplamTutar: 'Toplam Tutar (₺)',
                    ad: 'Müşteri Adı',
                    soyad: 'Müşteri Soyadı',
                    eposta: 'E-Posta',
                    telefon: 'Telefon',
                    siparisNumarasi: 'Sipariş No',
                    takipTokeni: 'Takip Tokeni (Gizli)',
                    adres: 'Adres',
                    sehir: 'Şehir',
                    ilce: 'İlçe',
                    postaKodu: 'Posta Kodu',
                    ulke: 'Ülke',
                    kurumsalMi: 'Kurumsal mı?',
                    sirketAdi: 'Şirket Adı',
                    vergiDairesi: 'Vergi Dairesi',
                    vergiNumarasi: 'Vergi Numarası',
                    odemeId: 'Ödeme ID',
                    odemeTokeni: 'Ödeme Tokeni',
                    odemeDurumu: 'Ödeme Durumu',
                    olusturulmaTarihi: 'Sipariş Tarihi',
                    guncellenmeTarihi: 'Güncelleme Tarihi'
                }
            }
        }
    }
};
