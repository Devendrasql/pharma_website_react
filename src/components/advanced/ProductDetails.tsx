import React, { useState } from 'react';
import { Star, Shield, Truck, Clock, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { Medicine } from '../../types';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { displayPrice } from '../../utils/currency';

interface ProductDetailsProps {
  medicine: Medicine;
  onClose: () => void;
  onAuthRequired: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ 
  medicine, 
  onClose, 
  onAuthRequired 
}) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');

  const handleAddToCart = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    await addToCart(medicine.id, quantity);
    onClose();
  };

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'usage', label: 'Usage & Dosage' },
    { id: 'warnings', label: 'Warnings' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Product Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={medicine.image_url || 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'}
                  alt={medicine.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{medicine.name}</h1>
                <p className="text-gray-600 mb-2">by {medicine.manufacturer}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(4.5) 234 reviews</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">100% Authentic</span>
                </div>
                <p className="text-sm text-blue-700">Sourced directly from manufacturers</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Free delivery in 2-3 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Express delivery in 6-8 hours (₹50)</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-blue-600">{displayPrice(medicine.price)}</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!medicine.in_stock}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-8">
            <div className="border-b">
              <div className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="py-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{medicine.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800">Active Ingredient</h4>
                      <p className="text-gray-600">{medicine.active_ingredient}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Dosage</h4>
                      <p className="text-gray-600">{medicine.dosage}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">How to Use</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Take as directed by your healthcare provider</li>
                      <li>Can be taken with or without food</li>
                      <li>Do not exceed recommended dosage</li>
                      <li>Complete the full course as prescribed</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'warnings' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Important Warnings</h3>
                    <ul className="list-disc list-inside text-red-700 space-y-1">
                      <li>Keep out of reach of children</li>
                      <li>Store in a cool, dry place</li>
                      <li>Check expiry date before use</li>
                      <li>Consult doctor if symptoms persist</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="font-medium">Excellent product!</span>
                    </div>
                    <p className="text-gray-600 text-sm">Works exactly as described. Fast delivery and good packaging.</p>
                    <p className="text-xs text-gray-500 mt-2">- Verified Buyer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};