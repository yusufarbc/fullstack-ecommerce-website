import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="footer" id="about">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-icon">✦</span>
                            <span className="logo-text">LuxeShop</span>
                        </div>
                        <p className="footer-description">
                            Premium kalitede ürünler ve benzersiz alışveriş deneyimi sunan modern e-ticaret platformu.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" fill="none" stroke="white" strokeWidth="2"></path>
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="white"></circle>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Facebook">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">Alışveriş</h4>
                        <ul className="footer-links">
                            <li><Link to="/products">Tüm Ürünler</Link></li>
                            <li><Link to="/products?filter=new">Yeni Gelenler</Link></li>
                            <li><Link to="/products?filter=sale">İndirimli Ürünler</Link></li>
                            <li><Link to="/products?filter=bestsellers">En Çok Satanlar</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">Müşteri Hizmetleri</h4>
                        <ul className="footer-links">
                            <li><Link to="/contact">İletişim</Link></li>
                            <li><Link to="/siparis-takip">Sipariş Takibi</Link></li>
                            <li><Link to="/returns">İade & Değişim</Link></li>
                            <li><Link to="/faq">SSS</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4 className="footer-title">Kurumsal</h4>
                        <ul className="footer-links">
                            <li><Link to="/about">Hakkımızda</Link></li>
                            <li><Link to="/careers">Kariyer</Link></li>
                            <li><Link to="/privacy">Gizlilik Politikası</Link></li>
                            <li><Link to="/terms">Kullanım Koşulları</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 LuxeShop. Tüm hakları saklıdır.</p>
                    <div className="payment-methods">
                        <span>💳</span>
                        <span>🏦</span>
                        <span>📱</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
