import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

/**
 * Header component containing navigation logo, search bar, and cart toggle.
 * 
 * @returns {JSX.Element} The rendered Header component.
 */
export function Header() {
    const { t } = useTranslation();
    const { toggleSidebar, cartCount } = useCart();
    const navigate = useNavigate();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="navbar">
            <div className="container">
                <div className="nav-content">
                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <span className="logo-icon">✦</span>
                        <span className="logo-text">LuxeShop</span>
                    </div>

                    <ul className="nav-links">
                        <li><span className="nav-link active" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Ana Sayfa</span></li>
                        <li><span className="nav-link" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>Ürünler</span></li>
                        <li><span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Kategoriler</span></li>
                        <li><span className="nav-link" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Hakkımızda</span></li>
                    </ul>

                    <div className="nav-actions">
                        <button className="icon-btn search-btn" aria-label="Ara">
                            <Search size={20} />
                        </button>
                        <button className="icon-btn cart-btn" aria-label="Sepet" onClick={toggleSidebar}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="cart-count">{cartCount}</span>
                            )}
                        </button>
                        <button className="icon-btn user-btn" aria-label="Profil" onClick={() => navigate('/admin')}>
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
