import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/axios';
import { CheckCircle, Clock, Package, AlertCircle, Phone, XCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next';

const OrderTrackingPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!token) {
                setError('Takip kodu bulunamadı.');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/v1/orders/track?token=${token}`);
                if (response.data.status === 'success') {
                    setOrder(response.data.data);
                } else {
                    setError('Sipariş bulunamadı.');
                }
            } catch (err) {
                setError('Sipariş bilgileri alınırken bir hata oluştu veya takip kodu geçersiz.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token]);

    const handleCancel = async () => {
        if (!window.confirm(t('orders.cancelConfirm'))) return;

        const reason = prompt(t('orders.cancelReason'));

        try {
            setLoading(true);
            await api.post(`/api/v1/orders/cancel`, { token, reason });
            // Refresh order
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') {
                setOrder(response.data.data);
                alert(t('orders.cancelSuccess'));
            }
        } catch (err) {
            alert(err.response?.data?.errorMessage || t('orders.cancelError'));
        } finally {
            setLoading(false);
        }
    };

    const whatsappLink = order ? `https://wa.me/905555555555?text=Merhaba, Sipariş No: ${order.orderNumber} hakkında destek almak istiyorum.` : '#';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    {t('status.backToHome')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">{t('header.trackOrder')}</h1>
                            <p className="text-blue-100 mt-1">Sipariş No: #{order.orderNumber}</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm flex gap-2">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-white hover:text-green-200 transition" title={t('orders.whatsappSupport')}>
                                <Phone size={20} />
                            </a>
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{t('orders.status')}:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'TAMAMLANDI' ? 'bg-green-100 text-green-700' :
                            order.status === 'BEKLEMEDE' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status === 'TAMAMLANDI' ? 'Tamamlandı' :
                                order.status === 'HAZIRLANIYOR' ? 'Hazırlanıyor' :
                                    order.status === 'KARGOLANDI' ? 'Kargoya Verildi' :
                                        order.status === 'TESLIM_EDILDI' ? 'Teslim Edildi' :
                                            order.status === 'IPTAL_EDILDI' ? 'İptal Edildi' :
                                                order.status === 'BEKLEMEDE' ? 'Ödeme Bekleniyor' : order.status}
                        </span>

                        {(order.status === 'BEKLEMEDE' || order.status === 'HAZIRLANIYOR') && (
                            <button
                                onClick={handleCancel}
                                className="ml-4 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition"
                            >
                                <XCircle size={14} /> {t('orders.cancelOrder')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Sipariş Detayları</h2>

                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-gray-100 p-2 rounded text-gray-400">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{item.urun.ad}</p>
                                        <p className="text-sm text-gray-500">{item.adet} Adet x ₺{Number(item.fiyat).toFixed(2)}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-800">₺{(Number(item.fiyat) * item.adet).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t pt-4">
                        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                            <span>Toplam Tutar</span>
                            <span>₺{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-900 mb-2">Teslimat Adresi</h3>
                        <p className="text-blue-800">{order.shippingAddress.district}, {order.shippingAddress.city}</p>
                        <p className="text-sm text-blue-600 mt-1">* Güvenlik nedeniyle tam adres gizlenmiştir.</p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 text-center border-t">
                    <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                        {t('cart.continueShopping')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
