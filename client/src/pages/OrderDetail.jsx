import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { ArrowLeft, Package, Calendar, MapPin, CreditCard } from 'lucide-react';

export function OrderDetail() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!email) {
                setError('Güvenlik nedeniyle bu sayfayı görüntülemek için e-posta doğrulaması gereklidir.');
                setLoading(false);
                return;
            }

            try {
                // Determine API endpoint. 
                // Since this is guest checkout, we might need a specific endpoint or use existing one.
                // Assuming currently GET /api/v1/orders/:id might be protected or not check email.
                // Ideally, we post database verification here or the API should handle it.
                // For this implementation, let's try fetching and handle 403/401 if restricted.
                // *Self-correction*: The implementation plan mentioned modifying Controller to verify email. 
                // I will add the logic here assuming the API *will* be updated to support this verification or currently supports it.
                // If API is strictly protected, this fetch will fail. 
                // Let's assume for this step I will update the API Controller next.

                const response = await api.get(`/api/v1/orders/${id}?email=${encodeURIComponent(email)}`);
                setOrder(response.data);
            } catch (err) {
                console.error(err);
                setError('Sipariş bulunamadı veya erişim yetkiniz yok.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, email]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 inline-block">
                {error}
            </div>
            <br />
            <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:underline flex items-center justify-center gap-2 inline-flex"
            >
                <ArrowLeft size={16} /> Ana Sayfaya Dön
            </button>
        </div>
    );

    if (!order) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate('/')}
                className="mb-8 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition"
            >
                <ArrowLeft size={20} /> Alışverişe Dön
            </button>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 text-white px-8 py-6 flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="text-green-400" />
                            Sipariş #{order.id}
                        </h1>
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                        <span className="text-sm uppercase tracking-wider font-semibold">
                            {order.status === 'SUCCESS' ? 'Onaylandı' : order.status}
                        </span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-blue-600" /> Teslimat Bilgileri
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="font-semibold text-gray-900">{order.guestName}</p>
                                <p className="text-gray-600">{order.address}</p>
                                <p className="text-gray-600">{order.zipCode} {order.city}</p>
                                <p className="text-gray-600 mt-2">{order.guestEmail}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-blue-600" /> Ödeme Özeti
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Ara Toplam</span>
                                    <span className="font-medium">₺{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Kargo</span>
                                    <span className="font-medium">Ücretsiz</span>
                                </div>
                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Toplam</span>
                                    <span className="text-blue-600">₺{Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Sipariş İçeriği</h3>
                    <div className="border rounded-xl overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adet</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.items && order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-0">
                                                    <div className="text-sm font-medium text-gray-900">{item.product ? item.product.name : 'Ürün'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₺{Number(item.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ₺{(Number(item.price) * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
