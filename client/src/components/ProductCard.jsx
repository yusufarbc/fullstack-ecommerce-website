import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

/**
 * ProductCard Component.
 * Displays product snippet (image, ad, fiyat) and add-to-cart button.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.product - The product object to display.
 * @returns {JSX.Element} The rendered component.
 */
export function ProductCard({ product }) {
    const { t } = useTranslation();
    const { addToCart } = useCart();

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`}>
                <div className="product-image">
                    {product.resimUrl ? (
                        <img
                            src={product.resimUrl}
                            alt={product.ad}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                            No Image
                        </div>
                    )}
                    {/* Optional Badge or Wishlist could go here */}
                </div>
            </Link>

            <div className="product-info">
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-name">{product.ad}</h3>
                </Link>
                {product.aciklama && (
                    <p className="product-description line-clamp-2">
                        {product.aciklama}
                    </p>
                )}

                {/* Placeholder Rating */}
                <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-count">(99+)</span>
                </div>

                <div className="product-footer">
                    <div className="product-price">
                        <span className="price-current">
                            ₺{Number(product.fiyat).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <button
                        onClick={() => addToCart(product)}
                        className="btn-add-cart"
                    >
                        Sepete Ekle
                    </button>
                </div>
            </div>
        </div>
    );
}
