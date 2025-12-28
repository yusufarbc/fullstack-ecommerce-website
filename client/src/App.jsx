import { Home } from './pages/Home';
import { CheckoutPage } from './pages/CheckoutPage';
import { ProductDetail } from './pages/ProductDetail';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentFailure } from './pages/PaymentFailure';
import { CartProvider } from './context/CartContext';
import { CartSidebar } from './components/CartSidebar';
import { Header } from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/payment/success" element={<PaymentSuccess />} />
                            <Route path="/payment/failure" element={<PaymentFailure />} />
                        </Routes>
                    </main>
                    <CartSidebar />
                </div>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;
