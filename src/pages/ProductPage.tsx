import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Share2, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Clock, 
  ChevronLeft, 
  Plus, 
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Medicine, Review } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { displayPrice } from '../utils/currency';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchMedicine();
      fetchReviews();
    }
  }, [id]);

  const fetchMedicine = async () => {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select(`
          *,
          category:categories(*),
          images:product_images(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setMedicine(data);
    } catch (error) {
      console.error('Error fetching medicine:', error);
      toast.error('Product not found');
      navigate('/');
    } finally {
      setLoading(false);
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
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    if (!medicine?.in_stock) {
      toast.error('Product is out of stock');
      return;
    }

    await addToCart(medicine.id, quantity);
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
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'usage', label: 'How to Use' },
    { id: 'sideeffects', label: 'Side Effects' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h1>
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

  const images = medicine.images && medicine.images.length > 0 
    ? medicine.images.sort((a, b) => a.display_order - b.display_order)
    : [{ image_url: medicine.image_url || '/placeholder-medicine.jpg', alt_text: medicine.name }];

  const discountPercentage = medicine.mrp && medicine.price < medicine.mrp 
    ? Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100)
    : medicine.discount_percentage || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Home
          </button>
          <span>/</span>
          {medicine.category && (
            <>
              <button 
                onClick={() => navigate(`/category/${medicine.category?.id}`)}
                className="hover:text-blue-600"
              >
                {medicine.category.name}
              </button>
              <span>/</span>
            </>
          )}
          <span className="text-gray-800">{medicine.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <img
                src={images[selectedImage]?.image_url || images[0]?.image_url}
                alt={images[selectedImage]?.alt_text || medicine.name}
                className="w-full h-96 object-contain"
              />
            </motion.div>
            
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={image.alt_text || `${medicine.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {medicine.category && (
                  <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                    {medicine.category.name}
                  </span>
                )}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 mb-2">
                  {medicine.name}
                </h1>
                <p className="text-gray-600 mb-2">by {medicine.manufacturer}</p>
                
                {medicine.average_rating && medicine.average_rating > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex">
                      {renderStars(medicine.average_rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({medicine.average_rating}) {medicine.total_reviews} reviews
                    </span>
                  </div>
                )}
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
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% OFF
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

            {/* Stock Status */}
            <div className="mb-6">
              {medicine.in_stock ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 bg-gray-100 rounded-lg font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
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
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.02]"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm border-t pt-6">
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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
            {activeTab === 'description' && (
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