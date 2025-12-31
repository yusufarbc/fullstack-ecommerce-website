import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { ProductCard } from '../components/ProductCard';
import { useTranslation } from 'react-i18next';
// import { CategoryFilter } from '../components/CategoryFilter'; // Omitting to match demo look

export function Home() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/api/v1/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (searchQuery) {
            result = result.filter(p =>
                p.ad.toLowerCase().includes(searchQuery) ||
                (p.aciklama && p.aciklama.toLowerCase().includes(searchQuery))
            );
        }

        setFilteredProducts(result);
    }, [searchQuery, products]);

    return (
        <>
            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-text">
                            <span className="hero-badge">Yeni Sezon Koleksiyonu</span>
                            <h1 className="hero-title">
                                Stilinizi <span className="gradient-text">Yeniden</span> Keşfedin
                            </h1>
                            <p className="hero-description">
                                Premium kalitede ürünler, özel tasarımlar ve benzersiz alışveriş deneyimi.
                                Tarzınızı yansıtan parçaları keşfedin.
                            </p>
                            <div className="hero-actions">
                                <button className="btn btn-primary" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
                                    Koleksiyonu İncele
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                                <button className="btn btn-secondary">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                    Tanıtım Videosu
                                </button>
                            </div>
                            <div className="hero-stats">
                                <div className="stat">
                                    <span className="stat-value">10K+</span>
                                    <span className="stat-label">Mutlu Müşteri</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">500+</span>
                                    <span className="stat-label">Premium Ürün</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-value">4.9</span>
                                    <span className="stat-label">Müşteri Puanı</span>
                                </div>
                            </div>
                        </div>
                        <div className="hero-image">
                            <div className="image-card">
                                <img src="/hero-product.jpg" alt="Premium Ürün Görseli" id="hero-img" onError={(e) => e.target.style.display = 'none'} />
                                <div className="image-badge">
                                    <span className="badge-icon">⚡</span>
                                    <span className="badge-text">%40 İndirim</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories" id="categories">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Popüler Kategoriler</h2>
                        <p className="section-description">İhtiyacınıza uygun kategoriyi seçin</p>
                    </div>
                    <div className="category-grid">
                        <div className="category-card" onClick={() => navigate('/products?category=moda')} style={{ cursor: 'pointer' }}>
                            <div className="category-icon">👔</div>
                            <h3 className="category-name">Moda</h3>
                            <p className="category-count">250+ Ürün</p>
                        </div>
                        <div className="category-card" onClick={() => navigate('/products?category=teknoloji')} style={{ cursor: 'pointer' }}>
                            <div className="category-icon">💻</div>
                            <h3 className="category-name">Teknoloji</h3>
                            <p className="category-count">180+ Ürün</p>
                        </div>
                        <div className="category-card" onClick={() => navigate('/products?category=ev')} style={{ cursor: 'pointer' }}>
                            <div className="category-icon">🏠</div>
                            <h3 className="category-name">Ev & Yaşam</h3>
                            <p className="category-count">320+ Ürün</p>
                        </div>
                        <div className="category-card" onClick={() => navigate('/products?category=spor')} style={{ cursor: 'pointer' }}>
                            <div className="category-icon">⚽</div>
                            <h3 className="category-name">Spor</h3>
                            <p className="category-count">150+ Ürün</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products Section */}
            <section className="products" id="products">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Öne Çıkan Ürünler</h2>
                        <p className="section-description">En çok tercih edilen premium ürünlerimiz</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                            {filteredProducts.length === 0 && (
                                <p className="text-center col-span-full text-gray-500">Ürün bulunamadı.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            </div>
                            <h3 className="feature-title">Ücretsiz Kargo</h3>
                            <p className="feature-description">500₺ ve üzeri alışverişlerde</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <h3 className="feature-title">Hızlı Teslimat</h3>
                            <p className="feature-description">Aynı gün kargo imkanı</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                </svg>
                            </div>
                            <h3 className="feature-title">Kolay İade</h3>
                            <p className="feature-description">14 gün içinde ücretsiz iade</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                    <line x1="1" y1="10" x2="23" y2="10"></line>
                                </svg>
                            </div>
                            <h3 className="feature-title">Güvenli Ödeme</h3>
                            <p className="feature-description">256-bit SSL şifreleme</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
