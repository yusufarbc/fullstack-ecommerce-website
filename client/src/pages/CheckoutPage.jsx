import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import turkeyData from '../data/turkiye.json';

import { useTranslation } from 'react-i18next';

export function CheckoutPage() {
    const { t } = useTranslation();
    const { cartItems, cartTotal } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        zipCode: '',
        isCorporate: false,
        companyName: '',
        taxOffice: '',
        taxNumber: ''
    });
    const [loading, setLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [errors, setErrors] = useState({});

    // Agreement state separate from formData for clarity, or just check DOM? 
    // Best to put in state.
    const [agreements, setAgreements] = useState({
        salesAgreement: false
    });

    const validateForm = () => {
        const newErrors = {};

        // Guest Info Validation
        if (!formData.fullName || formData.fullName.length < 2) {
            newErrors.fullName = 'Ad Soyad en az 2 karakter olmalıdır.';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Geçerli bir e-posta adresi giriniz.';
        }
        // Phone: Expect formatted or unformatted, but basically 10 digits + prefix
        const rawPhone = formData.phone.replace(/\D/g, '');
        if (rawPhone.length < 11 || !rawPhone.startsWith('05')) {
            newErrors.phone = 'Telefon numarası eksik veya hatalı (05XX...)';
        }
        if (!formData.address || formData.address.length < 10) {
            newErrors.address = 'Adres en az 10 karakter olmalıdır.';
        }
        if (!formData.city) newErrors.city = 'İl seçiniz.';
        if (!formData.district) newErrors.district = 'İlçe seçiniz.';
        if (!formData.zipCode || formData.zipCode.length < 3) {
            newErrors.zipCode = 'Posta kodu giriniz.';
        }

        // Corporate Info Validation
        if (formData.isCorporate) {
            if (!formData.companyName) newErrors.companyName = 'Şirket ünvanı zorunludur.';
            if (!formData.taxOffice) newErrors.taxOffice = 'Vergi dairesi zorunludur.';
            if (!formData.taxNumber) newErrors.taxNumber = 'Vergi numarası zorunludur.';
        }

        if (!agreements.salesAgreement) {
            newErrors.salesAgreement = 'Lütfen satış sözleşmesini onaylayınız.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 11) value = value.slice(0, 11); // Max 11 digits (0555...)

        // Simple formatting: 0555 555 55 55
        // If user starts typing 5, prepend 0
        if (value.length > 0 && value[0] !== '0') {
            value = '0' + value;
        }

        let formatted = value;
        if (value.length > 4) {
            formatted = `${value.slice(0, 4)} ${value.slice(4)}`;
        }
        if (value.length > 7) {
            formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`;
        }
        if (value.length > 9) {
            formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7, 9)} ${value.slice(9)}`;
        }

        setFormData({ ...formData, phone: formatted });
    };

    const handleCityChange = (e) => {
        const selectedCity = e.target.value;
        setFormData({ ...formData, city: selectedCity, district: '' });
        if (selectedCity && turkeyData[selectedCity]) {
            setDistricts(turkeyData[selectedCity]);
        } else {
            setDistricts([]);
        }
    };

    const handleSubmit = async (e) => {
        // HTML5 validation happens BEFORE this function runs.
        // If we get here, the browser thinks the form is valid (mostly).
        console.log("Form submitted, running custom validation...");
        e.preventDefault();

        if (!validateForm()) {
            console.log("Custom validation failed", errors);
            // We can still keep the alert as a backup or removal it if native behavior is enough.
            // User likes native behavior. Let's rely on native as much as possible, 
            // but validateForm has logic like "Company Name required IF Corporate".
            // Native 'required' can't handle conditional logic unless we set it dynamically.
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/api/v1/orders/checkout', {
                items: cartItems,
                guestInfo: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone.replace(/\s/g, ''),
                    address: formData.address,
                    city: formData.city,
                    district: formData.district,
                    zipCode: formData.zipCode
                },
                invoiceInfo: {
                    isCorporate: formData.isCorporate,
                    companyName: formData.companyName,
                    taxOffice: formData.taxOffice,
                    taxNumber: formData.taxNumber
                }
            });

            if (response.data.status === 'success' && response.data.paymentPageUrl) {
                window.location.href = response.data.paymentPageUrl;
            } else {
                alert('Ödeme Başarısız: ' + (response.data.errorMessage || 'Bilinmeyen Hata'));
            }

        } catch (error) {
            console.error('Checkout error (Full Details):', error.response ? error.response.data : error);

            let backendErrors = {};
            let hasMappedErrors = false;

            if (error.response && error.response.data && error.response.data.errors) {
                // Backend Zod Errors Mapping
                error.response.data.errors.forEach(err => {
                    // Try to extract a meaningful field name
                    // Path examples: ['guestInfo', 'name'] OR ['items'] OR ['phone']
                    let fieldName = null;
                    if (err.path && err.path.length > 1) {
                        fieldName = err.path[1];
                    } else if (err.path && err.path.length === 1) {
                        fieldName = err.path[0];
                    }

                    if (fieldName) {
                        backendErrors[fieldName] = err.message;
                        hasMappedErrors = true;
                    }
                });
                setErrors(backendErrors);
            }

            // Always show an alert so the user knows something went wrong.
            // If we mapped errors, say "Check fields". If not, say the specific message.
            if (hasMappedErrors) {
                alert("Lütfen formdaki kırmızı ile işaretlenen hataları düzeltiniz.");
            } else {
                // Should show "Validation Error" or whatever the backend sent
                const msg = (error.response && error.response.data && error.response.data.errorMessage)
                    ? error.response.data.errorMessage
                    : 'Ödeme sırasında beklenmedik bir hata oluştu.';
                alert('Hata: ' + msg);
            }
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="p-8 text-center text-gray-500">Sepetiniz boş.</div>;
    }

    const [showModal, setShowModal] = useState(null); // URL or null

    const handleLegalClick = (e, url) => {
        e.preventDefault();
        setShowModal(url);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">{t('checkout.title')}</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Guest Info */}
                    <div>
                        <h2 className="text-lg font-medium mb-4">{t('checkout.shippingInfo')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text" name="fullName" placeholder={t('checkout.name') + ' ' + t('checkout.surname')}
                                required minLength={2}
                                className={`border p-2 rounded ${errors.fullName ? 'border-red-500' : ''}`} onChange={handleInputChange}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}

                            <input
                                type="email" name="email" placeholder={t('checkout.email')}
                                required
                                className={`border p-2 rounded ${errors.email ? 'border-red-500' : ''}`} onChange={handleInputChange}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

                            <input
                                type="tel"
                                name="phone"
                                placeholder={t('checkout.phone') + " (05XX XXX XX XX)"}
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                maxLength={15} // 0555 555 55 55 is 14 chars approx
                                className={`border p-2 rounded md:col-span-2 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs md:col-span-2">{errors.phone}</p>}

                            <input
                                type="text" name="address" placeholder={t('checkout.address')}
                                required minLength={10}
                                className={`border p-2 rounded md:col-span-2 ${errors.address ? 'border-red-500' : ''}`} onChange={handleInputChange}
                            />
                            {errors.address && <p className="text-red-500 text-xs md:col-span-2">{errors.address}</p>}

                            {/* City Selection */}
                            <select
                                name="city"
                                value={formData.city}
                                onChange={handleCityChange}
                                className={`border p-2 rounded ${errors.city ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="">{t('checkout.city')}</option>
                                {Object.keys(turkeyData).sort().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            {/* District Selection */}
                            <select
                                name="district"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                className={`border p-2 rounded ${errors.district ? 'border-red-500' : ''}`}
                                required
                                disabled={!formData.city}
                            >
                                <option value="">{t('checkout.district')}</option>
                                {districts.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>

                            <input
                                type="text" name="zipCode" placeholder={t('checkout.zipCode')}
                                required minLength={3}
                                className={`border p-2 rounded md:col-span-2 ${errors.zipCode ? 'border-red-500' : ''}`} onChange={handleInputChange}
                            />
                            {errors.zipCode && <p className="text-red-500 text-xs md:col-span-2">{errors.zipCode}</p>}
                        </div>
                    </div>

                    {/* Corporate Invoice Option */}
                    <div className="border-t pt-4">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isCorporate"
                                name="isCorporate"
                                checked={formData.isCorporate}
                                onChange={(e) => setFormData({ ...formData, isCorporate: e.target.checked })}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isCorporate" className="ml-2 block text-sm text-gray-900 font-medium">
                                Kurumsal Fatura İstiyorum
                            </label>
                        </div>

                        {formData.isCorporate && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                                <div>
                                    <input
                                        type="text" name="companyName" placeholder="Şirket Ünvanı"
                                        required={formData.isCorporate}
                                        className={`border p-2 rounded w-full ${errors.companyName ? 'border-red-500' : ''}`} onChange={handleInputChange}
                                    />
                                    {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text" name="taxOffice" placeholder="Vergi Dairesi"
                                        required={formData.isCorporate}
                                        className={`border p-2 rounded w-full ${errors.taxOffice ? 'border-red-500' : ''}`} onChange={handleInputChange}
                                    />
                                    {errors.taxOffice && <p className="text-red-500 text-xs">{errors.taxOffice}</p>}
                                </div>
                                <div>
                                    <input
                                        type="text" name="taxNumber" placeholder="Vergi Numarası"
                                        required={formData.isCorporate}
                                        className={`border p-2 rounded w-full ${errors.taxNumber ? 'border-red-500' : ''}`} onChange={handleInputChange}
                                    />
                                    {errors.taxNumber && <p className="text-red-500 text-xs">{errors.taxNumber}</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Agreements & Legal */}
                    <div className="border-t pt-4 space-y-3">
                        <div className="flex items-start">
                            {/* KVKK Checkbox Removed as per new requirement */}
                            <p className="text-sm text-gray-600">
                                Sipariş vererek <button onClick={(e) => handleLegalClick(e, '/legal/kvkk.html')} className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer">KVKK Aydınlatma Metni</button>'ni okuduğunuzu ve verilerinizin sözleşme gereği işlenmesini kabul etmiş sayılırsınız.
                            </p>
                        </div>
                        <div className="flex items-start">
                            <input
                                type="checkbox" id="salesAgreement"
                                required
                                checked={agreements.salesAgreement}
                                onChange={(e) => {
                                    setAgreements({ ...agreements, salesAgreement: e.target.checked });
                                    if (e.target.checked && errors.salesAgreement) {
                                        setErrors({ ...errors, salesAgreement: null });
                                    }
                                }}
                                className={`h-4 w-4 mt-1 text-green-600 focus:ring-green-500 border-gray-300 rounded ${errors.salesAgreement ? 'border-red-500 outline-red-500' : ''}`}
                            />
                            <label htmlFor="salesAgreement" className={`ml-2 text-sm ${errors.salesAgreement ? 'text-red-500' : 'text-gray-600'}`}>
                                <button onClick={(e) => handleLegalClick(e, '/legal/on-bilgilendirme.html')} className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer">Ön Bilgilendirme Formu</button> ve <button onClick={(e) => handleLegalClick(e, '/legal/mesafeli-satis.html')} className="text-blue-600 hover:underline bg-transparent border-none p-0 cursor-pointer">Mesafeli Satış Sözleşmesi</button>'ni okudum ve onaylıyorum.
                            </label>
                            {errors.salesAgreement && <p className="text-red-500 text-xs w-full ml-6">{errors.salesAgreement}</p>}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                            <span>Toplam:</span>
                            <span>₺{cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? t('checkout.processing') : t('checkout.submitPayment')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Legal Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold">Sözleşme Metni</h3>
                            <button onClick={() => setShowModal(null)} className="text-gray-500 hover:text-gray-700 text-2xl">
                                &times;
                            </button>
                        </div>
                        <div className="flex-1 p-4 overflow-hidden">
                            <iframe
                                src={showModal}
                                className="w-full h-full border-0"
                                title="Legal Document"
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowModal(null)}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
