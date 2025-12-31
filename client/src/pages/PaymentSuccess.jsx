import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

import { useTranslation } from 'react-i18next';

export function PaymentSuccess() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const orderNumber = searchParams.get('orderNumber');

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">{t('status.success')}</h1>
            <p className="text-gray-600 mb-8">
                {t('status.paymentSuccessful')} {t('status.orderNumber')}: #{orderNumber}
            </p>

            <div className="flex flex-col gap-4 justify-center items-center">
                {searchParams.get('trackingToken') && (
                    <button
                        onClick={() => navigate(`/siparis-takip?token=${searchParams.get('trackingToken')}`)}
                        className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition w-full md:w-auto"
                    >
                        {t('header.trackOrder')}
                    </button>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition w-full md:w-auto"
                >
                    {t('cart.continueShopping')}
                </button>
            </div>
        </div>
    );
}
