// src/components/FeaturedProducts.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../hooks/useCart.tsx';
import { Star } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  in_stock: boolean;
  prescription_required: boolean;
  mrp?: number;
  discount_percentage?: number;
  average_rating?: number;
  total_reviews?: number;
}

const FeaturedProducts: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch a limited number of products, e.g., 8, ordered by creation date or rating
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .order('created_at', { ascending: false }) // Or 'average_rating'
          .limit(8); // Limit to show a few featured products

        if (error) throw error;
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching featured products:", err.message);
        setError("Failed to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCartClick = (medicineId: string) => {
    addToCart(medicineId, 1);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading featured products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Our Featured Products</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No featured products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col items-center text-center">
              <img
                src={medicine.image_url || `https://placehold.co/150x150/E0F2F7/000?text=${medicine.name}`}
                alt={medicine.name}
                className="w-32 h-32 object-contain mx-auto mb-4 rounded-md"
              />
              <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">{medicine.name}</h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{medicine.description}</p>
              {medicine.mrp && medicine.discount_percentage ? (
                <div className="flex items-center justify-center mb-2">
                  <span className="text-gray-500 line-through text-sm mr-2">₹{medicine.mrp.toFixed(2)}</span>
                  <span className="text-blue-700 font-bold text-lg">₹{medicine.price.toFixed(2)}</span>
                  <span className="ml-2 text-green-600 text-sm font-semibold">{medicine.discount_percentage}% OFF</span>
                </div>
              ) : (
                <p className="text-blue-700 font-bold text-lg mb-2">₹{medicine.price.toFixed(2)}</p>
              )}

              {medicine.average_rating !== undefined && medicine.total_reviews !== undefined && (
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <span className="mr-1 text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(medicine.average_rating || 0) ? "currentColor" : "none"} stroke="currentColor" />
                    ))}
                  </span>
                  <span>({medicine.total_reviews} reviews)</span>
                </div>
              )}

              <button
                onClick={() => navigate(`/product/${medicine.id}`)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold mb-2"
              >
                View Details
              </button>
              <button
                onClick={() => handleAddToCartClick(medicine.id)}
                disabled={!medicine.in_stock}
                className={`w-full px-4 py-2 rounded-md font-semibold ${
                  medicine.in_stock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                {medicine.in_stock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;
