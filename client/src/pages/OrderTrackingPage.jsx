import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, Package, AlertCircle } from 'lucide-react';

const OrderTrackingPage = () => {
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
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/orders/track?token=${token}`);
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
                    Ana Sayfaya Dön
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
                            <h1 className="text-2xl font-bold">Sipariş Takibi</h1>
                            <p className="text-blue-100 mt-1">Sipariş No: #{order.orderNumber}</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Clock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Durum:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {order.status === 'COMPLETED' ? 'Tamamlandı' :
                                order.status === 'PREPARING' ? 'Hazırlanıyor' :
                                    order.status === 'SHIPPED' ? 'Kargoya Verildi' :
                                        order.status === 'DELIVERED' ? 'Teslim Edildi' :
                                            order.status === 'PENDING' ? 'Ödeme Bekleniyor' : order.status}
                        </span>
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
                                        <p className="font-medium text-gray-800">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">{item.quantity} Adet x ₺{Number(item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-gray-800">₺{(Number(item.price) * item.quantity).toFixed(2)}</span>
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
                        Alışverişe Devam Et
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingPage;
