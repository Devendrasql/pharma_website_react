import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { Medicine } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { displayPrice } from '../utils/currency';

interface ProductCardProps {
  medicine: Medicine;
  onProductClick: (medicine: Medicine) => void;
  onAuthRequired: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ medicine, onProductClick, onAuthRequired }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    await addToCart(medicine.id);
  };

  const handleProductClick = () => {
    navigate(`/medicine/${medicine.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative">
        <img
          onClick={handleProductClick}
          src={medicine.image_url || 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'}
          alt={medicine.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {medicine.prescription_required && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Prescription Required
          </div>
        )}
        {!medicine.in_stock && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 
            onClick={handleProductClick}
            className="text-lg font-semibold text-gray-800 mb-1 hover:text-blue-600 cursor-pointer"
          >
            {medicine.name}
          </h3>
          <p className="text-sm text-gray-600">{medicine.dosage}</p>
        </div>
        
        <p 
          onClick={handleProductClick}
          className="text-sm text-gray-600 mb-3 line-clamp-2 cursor-pointer"
        >
          {medicine.description}
        </p>
        
        <div className="mb-3">
          <p className="text-xs text-gray-500">Manufacturer: {medicine.manufacturer}</p>
          {medicine.active_ingredient && (
            <p className="text-xs text-gray-500">Active: {medicine.active_ingredient}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div>
              <span className="text-2xl font-bold text-blue-600">{displayPrice(medicine.price)}</span>
              <div className="flex items-center mt-1">
                <div className="flex text-yellow-400">
                  {'★'.repeat(4)}{'☆'.repeat(1)}
                </div>
                <span className="text-xs text-gray-500 ml-1">(4.2)</span>
              </div>
            </div>
            {medicine.in_stock ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!medicine.in_stock}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-1 ${
              medicine.in_stock
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};