import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/api/v1/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error(err);
                setError('Ürün detayları yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error || !product) return (
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            <p className="text-red-500 mb-4">{error || 'Ürün bulunamadı'}</p>
            <button
                onClick={() => navigate('/')}
                className="text-primary-600 hover:underline flex items-center justify-center gap-2"
            >
                <ArrowLeft size={16} /> Ürünlere Geri Dön
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <button
                onClick={() => navigate(-1)}
                className="mb-8 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition"
            >
                <ArrowLeft size={20} /> Geri
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center bg-gray-50">
                    {product.resimUrl ? (
                        <img
                            src={product.resimUrl}
                            alt={product.ad}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <span className="text-gray-400">Görsel Mevcut Değil</span>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.ad}</h1>
                    <p className="text-2xl font-semibold text-primary-600 mb-6">₺{Number(product.fiyat).toFixed(2)}</p>

                    <div className="prose prose-lg text-gray-600 mb-8">
                        {product.aciklama ? (
                            <div dangerouslySetInnerHTML={{ __html: product.aciklama }} />
                        ) : (
                            <p>Bu ürün için açıklama bulunmuyor.</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 border-t pt-8">
                        <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-3 active:scale-95 transform duration-100"
                        >
                            <ShoppingCart size={24} />
                            Sepete Ekle
                        </button>
                    </div>

                    <div className="mt-6 text-sm text-gray-500">
                        Kategori: <span className="font-medium text-gray-900">{product.kategori ? product.kategori.ad : 'Genel'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
