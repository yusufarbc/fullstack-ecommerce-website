import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

/**
 * ProductCard Component.
 * Displays product snippet (image, name, price, stock) and add-to-cart button.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.product - The product object to display.
 * @returns {JSX.Element} The rendered component.
 */
export function ProductCard({ product }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
            <Link to={`/product/${product.id}`} className="block h-48 bg-gray-200 relative">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Görsel Yok
                    </div>
                )}
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">₺{Number(product.price).toFixed(2)}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition active:scale-95"
                        aria-label="Sepete ekle"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    Stok: {product.stock}
                </div>
            </div>
        </div>
    );
}
