import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * Header component containing navigation logo, search bar, and cart toggle.
 * 
 * @returns {JSX.Element} The rendered Header component.
 */
import { useTranslation } from 'react-i18next';

export function Header() {
    const { t } = useTranslation();
    const { toggleSidebar, cartCount } = useCart();
    const navigate = useNavigate();

    /**
     * Handles search input key press.
     * Navigates to search results on Enter key.
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
     */
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${encodeURIComponent(e.target.value)}`);
        }
    };

    return (
        <header className="bg-white shadow sticky top-0 z-40">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1
                    className="text-2xl font-black text-gray-900 tracking-tight cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    E-Shop
                </h1>

                <div className="flex-1 max-w-md mx-8 hidden sm:block relative">
                    <input
                        type="text"
                        placeholder={t('common.searchPlaceholder')}
                        className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        onKeyDown={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSidebar}
                        className="relative p-2 text-gray-600 hover:text-blue-600 transition rounded-full hover:bg-gray-100"
                    >
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
