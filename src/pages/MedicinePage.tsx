import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Share2, Heart, ShoppingCart, Truck, Shield, Clock, ChevronLeft, Plus, Minus } from 'lucide-react';
import { Medicine } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { displayPrice } from '../utils/currency';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  user_email?: string;
}

export const MedicinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchMedicine();
      fetchReviews();
      fetchDeliveryInfo();
    }
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setMedicine(data);
    } catch (error) {
      console.error('Error fetching medicine:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('medicine_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .eq('city', 'Mumbai')
        .single();

      if (error) throw error;
      setDeliveryInfo(data);
    } catch (error) {
      console.error('Error fetching delivery info:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login
      return;
    }
    await addToCart(medicine!.id, quantity);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: medicine?.name,
          text: medicine?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'usage', label: 'How to Use' },
    { id: 'sideeffects', label: 'Side Effects' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => {}} onAuthClick={() => {}} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => {}} onAuthClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Medicine not found</h1>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => {}} onAuthClick={() => {}} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Home
          </button>
          <span>/</span>
          <span>{medicine.category?.name}</span>
          <span>/</span>
          <span className="text-gray-800">{medicine.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-xl p-6">
            <img
              src={medicine.image_url || 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'}
              alt={medicine.name}
              className="w-full h-96 object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{medicine.name}</h1>
                <p className="text-gray-600 mb-2">by {medicine.manufacturer}</p>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {renderStars(Math.floor(medicine.average_rating || 0))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({medicine.average_rating}) {medicine.total_reviews} reviews
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-3xl font-bold text-green-600">
                  {displayPrice(medicine.price)}
                </span>
                {medicine.mrp && medicine.mrp > medicine.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {displayPrice(medicine.mrp)}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {medicine.discount_percentage}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Key Information */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <span className="text-gray-600">Pack Size:</span>
                <span className="ml-2 font-medium">{medicine.pack_size || medicine.dosage}</span>
              </div>
              <div>
                <span className="text-gray-600">Prescription:</span>
                <span className="ml-2 font-medium">
                  {medicine.prescription_required ? 'Required' : 'Not Required'}
                </span>
              </div>
            </div>

            {/* Delivery Info */}
            {deliveryInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">
                    Free delivery in {deliveryInfo.estimated_delivery_hours} hours
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Order above {displayPrice(deliveryInfo.free_delivery_threshold)} for free delivery
                </p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
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
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!medicine.in_stock}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
            </button>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center text-sm">
              <div className="flex flex-col items-center">
                <Shield className="h-6 w-6 text-blue-600 mb-1" />
                <span className="text-gray-600">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-6 w-6 text-green-600 mb-1" />
                <span className="text-gray-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-6 w-6 text-orange-600 mb-1" />
                <span className="text-gray-600">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
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

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">About {medicine.name}</h3>
                  <p className="text-gray-700 leading-relaxed">{medicine.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Key Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Ingredient:</span>
                        <span className="font-medium">{medicine.active_ingredient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dosage:</span>
                        <span className="font-medium">{medicine.dosage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Manufacturer:</span>
                        <span className="font-medium">{medicine.manufacturer}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Storage</h4>
                    <p className="text-sm text-gray-700">
                      {medicine.storage_instructions || 'Store in a cool, dry place away from direct sunlight.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">How to Use</h3>
                <div className="prose text-gray-700">
                  <p>{medicine.how_to_use || 'Take as directed by your healthcare provider.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'sideeffects' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Side Effects & Precautions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Common Side Effects</h4>
                    <p className="text-gray-700">{medicine.side_effects || 'Consult your doctor for information about side effects.'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Precautions</h4>
                    <p className="text-gray-700">{medicine.precautions || 'Follow your doctor\'s instructions carefully.'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Customer Reviews</h3>
                
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            {review.verified_purchase && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {review.title && (
                          <h4 className="font-medium text-gray-800 mb-2">{review.title}</h4>
                        )}
                        
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>By Customer</span>
                          <button className="hover:text-blue-600">
                            Helpful ({review.helpful_count})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};