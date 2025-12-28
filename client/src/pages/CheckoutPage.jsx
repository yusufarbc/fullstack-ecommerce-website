import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';

export function CheckoutPage() {
    const { cartItems, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        cardHolderName: '',
        cardNumber: '',
        expireMonth: '',
        expireYear: '',
        cvc: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // In a real Iyzico integration, we would likely get a Checkout Form URL from backend
            // or send card details to backend (PCI-DSS compliance required for raw card data).
            // For this architecture, we will assume we send order basics and get a Redirect URL or success.

            const response = await api.post('/api/v1/orders/checkout', {
                items: cartItems,
                guestInfo: {
                    name: formData.fullName,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode
                },
                paymentInfo: {
                    // sending raw card data for demonstration of "API-based" flow, 
                    // ideally use Iyzico Hosted Checkout Form if not PCI-compliant
                    cardHolderName: formData.cardHolderName,
                    cardNumber: formData.cardNumber,
                    expireMonth: formData.expireMonth,
                    expireYear: formData.expireYear,
                    cvc: formData.cvc
                }
            });

            if (response.data.status === 'success' && response.data.paymentPageUrl) {
                window.location.href = response.data.paymentPageUrl;
            } else {
                alert('Payment Failed: ' + (response.data.errorMessage || 'Unknown error'));
            }

        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout.');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="p-8 text-center text-gray-500">Your cart is empty.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest Info */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" name="fullName" placeholder="Full Name" required
                                className="border p-2 rounded" onChange={handleInputChange}
                            />
                            <input
                                type="email" name="email" placeholder="Email" required
                                className="border p-2 rounded" onChange={handleInputChange}
                            />
                            <input
                                type="text" name="address" placeholder="Address" required
                                className="border p-2 rounded md:col-span-2" onChange={handleInputChange}
                            />
                            <input
                                type="text" name="city" placeholder="City" required
                                className="border p-2 rounded" onChange={handleInputChange}
                            />
                            <input
                                type="text" name="zipCode" placeholder="Zip Code" required
                                className="border p-2 rounded" onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">Payment Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" name="cardHolderName" placeholder="Card Holder Name" required
                                className="border p-2 rounded md:col-span-2" onChange={handleInputChange}
                            />
                            <input
                                type="text" name="cardNumber" placeholder="Card Number" required
                                className="border p-2 rounded md:col-span-2" onChange={handleInputChange}
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text" name="expireMonth" placeholder="MM" required
                                    className="border p-2 rounded w-full" onChange={handleInputChange}
                                />
                                <input
                                    type="text" name="expireYear" placeholder="YY" required
                                    className="border p-2 rounded w-full" onChange={handleInputChange}
                                />
                            </div>
                            <input
                                type="text" name="cvc" placeholder="CVC" required
                                className="border p-2 rounded" onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Total:</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Complete Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
