import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Phone, MapPin, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  onCartClick: () => void;
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onCartClick,
  onAuthClick
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <button
                  onClick={() => navigate('/orders')}
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <span>My Orders</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 hover:text-blue-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-1 hover:text-blue-200"
              >
                <User className="h-4 w-4" />
                <span>Login / Register</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <div className="h-8 w-8 flex items-center justify-center font-bold text-lg">
                Rx
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">HealthMart</h1>
              <p className="text-sm text-gray-600">Your Trusted Pharmacy</p>
            </div>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            <a href="#medicines" className="text-gray-700 hover:text-blue-600 font-medium">Medicines</a>
            <a href="#health-checkup" className="text-gray-700 hover:text-blue-600 font-medium">Health Checkup</a>
            <a href="#lab-tests" className="text-gray-700 hover:text-blue-600 font-medium">Lab Tests</a>
            <a href="#articles" className="text-gray-700 hover:text-blue-600 font-medium">Health Articles</a>
            <a href="#offers" className="text-gray-700 hover:text-blue-600 font-medium">Offers</a>
          </div>

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="font-medium">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};