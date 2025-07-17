// src/pages/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../hooks/useCart.tsx';
import { Star } from 'lucide-react';

// Define interfaces based on your Supabase schema
interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  image_url?: string;
  in_stock: boolean;
  prescription_required: boolean;
  dosage?: string;
  manufacturer?: string;
  active_ingredient?: string;
  created_at: string;
  updated_at: string;
  how_to_use?: string;
  side_effects?: string;
  precautions?: string;
  storage_instructions?: string;
  pack_size?: string;
  mrp?: number;
  discount_percentage?: number;
  average_rating?: number;
  total_reviews?: number;
  categories?: { name: string }; // Nested category name
}

interface Review {
  id: string;
  user_id: string;
  medicine_id: string;
  rating: number;
  title?: string;
  comment?: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  users?: { email: string }; // Join with auth.users
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'howToUse' | 'sideEffects' | 'precautions' | 'storage' | 'reviews'>('description');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("No product ID provided in the URL.");
        setLoading(false);
        return;
      }

      try {
        // Fetch medicine details and join with categories to get category name
        const { data: medicineData, error: medicineError } = await supabase
          .from('medicines')
          .select(`
            *,
            categories (name)
          `)
          .eq('id', id)
          .single();

        if (medicineError) {
          console.error("Supabase medicine fetch error:", medicineError);
          throw new Error(`Failed to fetch medicine: ${medicineError.message}`);
        }
        if (!medicineData) {
          setError("Medicine not found.");
          setLoading(false);
          return;
        }
        setMedicine(medicineData as Medicine);

        // Fetch reviews for this medicine, joining with auth.users to get user email
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            users (email)
          `)
          .eq('medicine_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error("Supabase reviews fetch error:", reviewsError);
          setReviews([]); // Set to empty array if reviews fail
        } else {
          setReviews(reviewsData as Review[]);
        }

      } catch (err: any) {
        console.error("Overall error fetching product details or reviews:", err);
        setError(err.message || "Failed to load product details or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (medicine && quantityToAdd > 0) {
      addToCart(medicine.id, quantityToAdd);
    } else if (quantityToAdd <= 0) {
      alert("Quantity must be at least 1.");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <span className="flex items-center text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" />
        ))}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!medicine) {
    return <div className="text-center py-10 text-gray-600">Product not found.</div>;
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4"> {/* Added container for consistent width */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 hidden">Product Details</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 lg:flex lg:items-start lg:space-x-8"> {/* Increased shadow */}
          {/* Product Image Section */}
          <div className="lg:w-1/3 flex justify-center mb-6 lg:mb-0">
            <div className="relative w-full max-w-xs lg:max-w-none"> {/* Added relative container for image */}
              <img
                src={medicine.image_url || `https://placehold.co/300x300/E0F2F7/000?text=${medicine.name}`}
                alt={medicine.name}
                className="w-full h-auto object-contain rounded-lg border border-gray-200 shadow-md"
              />
              {medicine.discount_percentage && medicine.discount_percentage > 0 && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                  {medicine.discount_percentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{medicine.name}</h2>

            {/* Price and Discount */}
            {medicine.mrp && medicine.discount_percentage ? (
              <div className="flex items-center mb-3"> {/* Adjusted margin-bottom */}
                <span className="text-gray-500 line-through text-xl mr-3">₹{medicine.mrp.toFixed(2)}</span> {/* Larger strikethrough */}
                <span className="text-blue-700 font-bold text-3xl">₹{medicine.price.toFixed(2)}</span> {/* Larger price */}
              </div>
            ) : (
              <p className="text-blue-700 font-bold text-3xl mb-3">₹{medicine.price.toFixed(2)}</p>
            )}

            {/* Rating and Reviews */}
            {medicine.average_rating !== undefined && medicine.total_reviews !== undefined && (
              <div className="flex items-center text-gray-700 mb-4">
                {renderStars(medicine.average_rating)}
                <span className="ml-2 text-sm text-gray-600">
                  {medicine.average_rating.toFixed(1)} ({medicine.total_reviews} reviews)
                </span>
              </div>
            )}

            <p className="text-gray-700 mb-6 leading-relaxed">{medicine.description}</p> {/* Increased line-height */}

            {/* Key Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-base text-gray-700 mb-8"> {/* Larger text, more gap */}
              <p><span className="font-semibold">Category:</span> {medicine.categories?.name || 'N/A'}</p>
              <p><span className="font-semibold">Manufacturer:</span> {medicine.manufacturer || 'N/A'}</p>
              <p><span className="font-semibold">Active Ingredient:</span> {medicine.active_ingredient || 'N/A'}</p>
              <p><span className="font-semibold">Dosage:</span> {medicine.dosage || 'N/A'}</p>
              <p><span className="font-semibold">Pack Size:</span> {medicine.pack_size || 'N/A'}</p>
              <p className="col-span-full">
                <span className="font-semibold">Availability:</span> <span className={`font-medium ${medicine.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {medicine.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
                {medicine.prescription_required && (
                  <span className="ml-4 text-orange-600 font-semibold"> (Prescription Required)</span>
                )}
              </p>
            </div>

            {/* Quantity selector and Add to Cart button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6"> {/* Responsive layout for buttons */}
              <label htmlFor="quantity" className="text-gray-700 font-medium whitespace-nowrap">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantityToAdd}
                onChange={(e) => setQuantityToAdd(parseInt(e.target.value))}
                className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg"
              />
              <button
                onClick={handleAddToCart}
                disabled={!medicine.in_stock || quantityToAdd < 1}
                className={`flex-grow px-8 py-3 rounded-md font-bold text-lg transition-colors ${
                  medicine.in_stock && quantityToAdd >= 1
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                {medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs for detailed information */}
        <div className="mt-10 bg-white rounded-lg shadow-lg p-6"> {/* Increased shadow */}
          <div className="border-b border-gray-200 mb-6"> {/* Added margin-bottom */}
            <nav className="-mb-px flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8" aria-label="Tabs"> {/* Responsive tabs */}
              <button
                onClick={() => setActiveTab('description')}
                className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                  activeTab === 'description'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                Description
              </button>
              {medicine.how_to_use && (
                <button
                  onClick={() => setActiveTab('howToUse')}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                    activeTab === 'howToUse'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  How to Use
                </button>
              )}
              {medicine.side_effects && (
                <button
                  onClick={() => setActiveTab('sideEffects')}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                    activeTab === 'sideEffects'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  Side Effects
                </button>
              )}
              {medicine.precautions && (
                <button
                  onClick={() => setActiveTab('precautions')}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                    activeTab === 'precautions'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  Precautions
                </button>
              )}
              {medicine.storage_instructions && (
                <button
                  onClick={() => setActiveTab('storage')}
                  className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                    activeTab === 'storage'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                  }`}
                >
                  Storage
                </button>
              )}
              <button
                onClick={() => setActiveTab('reviews')}
                className={`whitespace-nowrap py-3 px-4 border-b-2 font-semibold text-base transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6 text-gray-700 leading-relaxed"> {/* Added text color and line-height */}
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Description</h3>
                <p>{medicine.description || 'No description available.'}</p>
              </div>
            )}
            {activeTab === 'howToUse' && medicine.how_to_use && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How to Use</h3>
                <p>{medicine.how_to_use}</p>
              </div>
            )}
            {activeTab === 'sideEffects' && medicine.side_effects && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Side Effects</h3>
                <p>{medicine.side_effects}</p>
              </div>
            )}
            {activeTab === 'precautions' && medicine.precautions && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Precautions</h3>
                <p>{medicine.precautions}</p>
              </div>
            )}
            {activeTab === 'storage' && medicine.storage_instructions && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Storage Instructions</h3>
                <p>{medicine.storage_instructions}</p>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Reviews ({reviews.length})</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-blue-700 mr-2">{review.users?.email ? review.users.email.split('@')[0] : 'Anonymous User'}</span>
                          {renderStars(review.rating)}
                        </div>
                        {review.title && <h4 className="font-medium text-gray-800 mb-1">{review.title}</h4>}
                        {review.comment && <p className="text-gray-700 text-sm">{review.comment}</p>}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString()}
                          {review.verified_purchase && <span className="ml-2 text-green-600 font-semibold"> (Verified Purchase)</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
