import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { PrescriptionUpload } from './components/advanced/PrescriptionUpload';
import { SearchBar } from './components/advanced/SearchBar';
import { HealthArticles } from './components/advanced/HealthArticles';
import { HealthCheckup } from './components/advanced/HealthCheckup';
import { DeliveryTracker } from './components/advanced/DeliveryTracker';
import { QuickOrderRefill } from './components/advanced/QuickOrderRefill';
import { HealthReminders } from './components/advanced/HealthReminders';
import { Cart } from './components/Cart';
import { OrderForm } from './components/OrderForm';
import { AuthModal } from './components/AuthModal';
import { LiveCartUpdates } from './components/LiveCartUpdates';
import { PromotionCards } from './components/PromotionCards';
import { MedicinePage } from './pages/MedicinePage';
import { OrdersPage } from './pages/OrdersPage';
import { Footer } from './components/Footer';
import { Medicine, Category } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import { useGeolocation } from './hooks/useGeolocation';

const HomePage: React.FC = () => {
  const { loading: authLoading } = useAuth();
  const { deliveryInfo } = useGeolocation();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [] = useState<Medicine | null>(null);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch medicines with categories
      const { data: medicinesData, error: medicinesError } = await supabase
        .from('medicines')
        .select(`
          *,
          category:categories(*)
        `)
        .order('name');

      if (medicinesError) throw medicinesError;

      setCategories([{ id: 'all', name: 'All', description: null, created_at: '' }, ...(categoriesData || [])]);
      setMedicines(medicinesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleOrderSuccess = () => {
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  const handleAuthRequired = () => {
    setIsAuthModalOpen(true);
  };

  const handleProductClick = (medicine: Medicine) => {
    // Navigate to medicine page instead of opening modal
    window.location.href = `/medicine/${medicine.id}`;
  };

  const handlePrescriptionUpload = (file: File) => {
    console.log('Prescription uploaded:', file);
    // Handle prescription upload logic here
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (medicine.description && medicine.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || medicine.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthModalOpen(true)}
      />

      {/* Offers Banner */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Special Offers & Deals</h2>
            <p className="text-blue-100">Save more on your health essentials</p>
          </div>
          <PromotionCards />
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {orderSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Order placed successfully! We'll contact you shortly to confirm delivery details.</p>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">आपका स्वास्थ्य, हमारी प्राथमिकता</h1>
          <p className="text-xl mb-6">Quality medications and health products delivered across India</p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-6">
            <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
          </div>
          
          {/* Delivery Info */}
          {deliveryInfo && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4 text-center">
              <p className="text-white">
                🚚 Free delivery in {deliveryInfo.estimated_delivery_hours} hours 
                {deliveryInfo.is_express_available && (
                  <span> • Express delivery available in {deliveryInfo.express_hours} hours</span>
                )}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Licensed Pharmacy</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Free Delivery in India</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Health Checkups Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Medicine Reminders</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>UPI & COD Available</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setShowPrescriptionUpload(true)}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              📋
            </div>
            <h3 className="font-semibold text-gray-800">Upload Prescription</h3>
            <p className="text-sm text-gray-600">Get medicines delivered</p>
          </button>
          
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              🏥
            </div>
            <h3 className="font-semibold text-gray-800">Health Checkup</h3>
            <p className="text-sm text-gray-600">Book lab tests</p>
          </button>
          
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              🔔
            </div>
            <h3 className="font-semibold text-gray-800">Medicine Reminders</h3>
            <p className="text-sm text-gray-600">Never miss a dose</p>
          </button>
          
          <button className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              📦
            </div>
            <h3 className="font-semibold text-gray-800">Track Order</h3>
            <p className="text-sm text-gray-600">Real-time updates</p>
          </button>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories.map(cat => cat.name)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map(medicine => (
            <ProductCard
              key={medicine.id}
              medicine={medicine}
              onProductClick={handleProductClick}
              onAuthRequired={handleAuthRequired}
            />
          ))}
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No medicines found matching your criteria.</p>
          </div>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <QuickOrderRefill />
          <HealthReminders />
        </div>

        <div className="mt-12">
          <DeliveryTracker />
        </div>
      </main>

      {/* Health Checkup Section */}
      <HealthCheckup />

      {/* Health Articles */}
      <HealthArticles />

      <Footer />

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
        onAuthRequired={handleAuthRequired}
      />

      {/* Order Form */}
      <OrderForm
        isOpen={isOrderFormOpen}
        onClose={() => setIsOrderFormOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Prescription Upload Modal */}
      {showPrescriptionUpload && (
        <PrescriptionUpload
          onUpload={handlePrescriptionUpload}
          onClose={() => setShowPrescriptionUpload(false)}
        />
      )}
      
      {/* Live Cart Updates */}
      <LiveCartUpdates />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/medicine/:id" element={<MedicinePage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}

export default App;