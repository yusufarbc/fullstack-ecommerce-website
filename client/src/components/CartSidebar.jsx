import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * CartSidebar Component.
 * Displays the current cart items, total price, and checkout button.
 * Slides in from the right.
 * 
 * @returns {JSX.Element|null} The rendered component or null if closed.
 */
export function CartSidebar() {
    const {
        isSidebarOpen,
        closeSidebar,
        cartItems,
        updateQuantity,
        removeFromCart,
        cartTotal
    } = useCart();

    if (!isSidebarOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={closeSidebar}
            />
            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-xl flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-6 border-b">
                        <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                        <button
                            onClick={closeSidebar}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <p>Your cart is empty.</p>
                                <button
                                    onClick={closeSidebar}
                                    className="mt-4 text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        ) : (
                            <ul className="space-y-6">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="flex py-2">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border rounded">
                                                    <button
                                                        className="p-1 hover:bg-gray-100"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-2">{item.quantity}</span>
                                                    <button
                                                        className="p-1 hover:bg-gray-100"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                                <p>Subtotal</p>
                                <p>${cartTotal.toFixed(2)}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        closeSidebar();
                                        window.location.href = '/checkout';
                                    }}
                                    className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
