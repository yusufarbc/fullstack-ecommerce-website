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

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

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

    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        try {
            setLoading(true);
            await api.post(`/api/v1/orders/cancel`, { token, reason: cancelReason });
            // Refresh order
            const response = await api.get(`/api/v1/orders/track?token=${token}`);
            if (response.data.status === 'success') {
                setOrder(response.data.data);
                setIsCancelModalOpen(false);
                setCancelReason("");
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
                    {t('status.backToHome')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 relative">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">{t('header.trackOrder')}</h1>
                            <p className="text-primary-100 mt-1">Sipariş No: #{order.orderNumber}</p>
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
                                onClick={handleCancelClick}
                                className="ml-auto sm:ml-4 flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition"
                            >
                                <XCircle size={14} /> {t('orders.cancelOrder')}
                            </button>
                        )}

                        {(['KARGOLANDI', 'TESLIM_EDILDI', 'TAMAMLANDI'].includes(order.status)) && (
                            <div className="ml-auto sm:ml-4 flex items-center gap-1 text-gray-500 text-xs sm:text-sm bg-gray-100 px-3 py-1 rounded-full border border-gray-200" title="Sipariş kargoya verildiği için bu aşamada iptal edilemez. Lütfen bizimle iletişime geçin.">
                                <AlertCircle size={14} />
                                <span className="hidden sm:inline">Kargolandığı için iptal edilemez</span>
                                <span className="sm:hidden">İptal Edilemez</span>
                            </div>
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

                    <div className="mt-8 border-t pt-4 space-y-2">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Ara Toplam</span>
                            <span>₺{Number(order.totalAmount - (order.shippingFee || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Kargo Ücreti</span>
                            {Number(order.shippingFee) > 0 ? (
                                <span>₺{Number(order.shippingFee).toFixed(2)}</span>
                            ) : (
                                <span className="text-green-600 font-medium">Ücretsiz</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center text-xl font-bold text-gray-900 border-t pt-2 mt-2">
                            <span>Toplam Tutar</span>
                            <span>₺{Number(order.totalAmount).toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-8 bg-primary-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-primary-900 mb-2">Teslimat Adresi</h3>
                        <p className="text-primary-800">{order.shippingAddress.district}, {order.shippingAddress.city}</p>
                        <p className="text-sm text-primary-600 mt-1">* Güvenlik nedeniyle tam adres gizlenmiştir.</p>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 text-center border-t">
                    <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium hover:underline">
                        {t('cart.continueShopping')}
                    </Link>
                </div>
            </div>

            {/* Cancel Order Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                    {t('orders.cancelOrder')}
                                </h3>
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6 font-medium">
                                {t('orders.cancelConfirm')}
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('orders.cancelReason')} (İsteğe bağlı)
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-h-[100px] resize-none text-sm"
                                    placeholder="Lütfen iptal nedeninizi kısaca belirtin..."
                                />
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                                >
                                    Vazgeç
                                </button>
                                <button
                                    onClick={confirmCancel}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-lg shadow-red-500/30 transition-all hover:scale-[1.02]"
                                >
                                    Siparişi İptal Et
                                </button>
                            </div>
                        </div>
                        <div className="bg-red-50 p-4 border-t border-red-100 flex items-center gap-2 text-sm text-red-700">
                            <span className='font-semibold'>⚠️ Dikkat:</span> Bu işlem geri alınamaz.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTrackingPage;
