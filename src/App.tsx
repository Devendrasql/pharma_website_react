// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Header } from './components/Header';
// import { MedicinePage } from './pages/MedicinePage';
// import { OrdersPage } from './pages/OrdersPage';
// import { TrackOrderPage } from './pages/TrackOrderPage';
// import { MedicineRemindersPage } from './pages/MedicineRemindersPage';
// import { HomePage } from './pages/HomePage';


// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/medicine/:id" element={<MedicinePage />} />
//         <Route path="/orders" element={<OrdersPage />} />
//         <Route path="/track-order" element={<TrackOrderPage />} />
//         <Route path="/reminders" element={<MedicineRemindersPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // Ensure this file exists
import AuthModal from './components/AuthModal'; // Ensure this file exists
import CartModal from './components/CartModal'; // Ensure this file exists
import { AuthProvider } from './hooks/useAuth.tsx'; // <-- CORRECTED: Changed .ts to .tsx
import { CartProvider } from './hooks/useCart.tsx'; // This one was already correct

// Import your page components (create these files if they don't exist)
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import DashboardPage from './pages/DashboardPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPanelPage from './pages/AdminPanelPage';


function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false); // Example state for order success

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 font-inter antialiased">
            <Header
              setIsCartOpen={setIsCartOpen}
              setIsAuthModalOpen={setIsAuthModalOpen}
              isCartOpen={isCartOpen}
              isAuthModalOpen={isAuthModalOpen}
            />

            <main className="flex-grow container mx-auto p-4 md:p-8 max-w-7xl">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products/:category?" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/orders" element={<OrderHistoryPage />} />
                <Route path="/dashboard/profile" element={<UserProfilePage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
                {/* Add more routes as needed */}
              </Routes>
            </main>

            <Footer />

            {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
            {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

            {orderSuccess && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-green-600 mb-4">Order Placed Successfully!</h2>
                  <p className="text-gray-700">Thank you for your purchase.</p>
                  <button
                    onClick={() => setOrderSuccess(false)}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
