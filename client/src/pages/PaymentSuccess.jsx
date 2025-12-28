import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

export function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your order #{orderId} has been confirmed.
            </p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
            >
                Continue Shopping
            </button>
        </div>
    );
}
