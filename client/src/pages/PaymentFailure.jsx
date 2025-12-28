import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function PaymentFailure() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const errorMessage = searchParams.get('errorMessage');

    return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-6">
                <XCircle size={64} className="text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Ödeme Başarısız</h1>
            <p className="text-gray-600 mb-8">
                Maalesef ödeme işleminiz gerçekleştirilemedi.
            </p>
            {errorMessage && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8">
                    {errorMessage}
                </div>
            )}
            <button
                onClick={() => navigate('/checkout')}
                className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
            >
                Tekrar Dene
            </button>
        </div>
    );
}
