// src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { useCart } from '../hooks/useCart.tsx'; // Import useCart hook

// Define interfaces based on your Supabase schema
interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url?: string;
  in_stock: boolean;
  prescription_required: boolean;
  dosage?: string;
  manufacturer?: string;
  active_ingredient?: string;
  created_at: string;
  updated_at: string;
  mrp?: number; // Added from enhanced schema
  discount_percentage?: number; // Added from enhanced schema
  average_rating?: number; // Added from enhanced schema
  total_reviews?: number; // Added from enhanced schema
  // Add other fields from your medicines table as needed
}

interface Category {
  id: string;
  name: string;
}

const ProductsPage: React.FC = () => {
  const { category: urlCategoryName } = useParams<{ category?: string }>(); // Get category slug from URL
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setSelectedCategoryId] = useState<string | null>(null);

  // Effect to fetch categories (needed to map category name to ID for filtering)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name');
        if (error) throw error;
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err.message);
        setError("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Effect to fetch medicines based on category filter
  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      setError(null);
      let query = supabase.from('medicines').select('*');

      // If a category name is in the URL, find its ID and filter
      if (urlCategoryName && categories.length > 0) {
        const matchingCategory = categories.find(cat => cat.name.toLowerCase().replace(/\s+/g, '-') === urlCategoryName);
        if (matchingCategory) {
          query = query.eq('category_id', matchingCategory.id);
          setSelectedCategoryId(matchingCategory.id);
        } else {
          // If category in URL doesn't match, show all products and set error
          setError(`Category "${urlCategoryName.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}" not found. Showing all products.`);
          setSelectedCategoryId(null); // Clear selected category if not found
        }
      } else {
        setSelectedCategoryId(null); // No category selected if URL param is absent
      }

      try {
        const { data, error } = await query;
        if (error) throw error;
        setMedicines(data);
      } catch (err: any) {
        console.error("Error fetching medicines:", err.message);
        setError("Failed to load medicines.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch medicines if categories are loaded (if a category filter is present)
    // or if no category filter is present.
    if (!urlCategoryName || categories.length > 0) {
      fetchMedicines();
    }
  }, [urlCategoryName, categories]); // Re-run when URL category changes or categories are loaded

  const handleAddToCartClick = (medicineId: string) => {
    addToCart(medicineId, 1); // Add 1 quantity by default
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading medicines...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
        {urlCategoryName ? `Products in ${urlCategoryName.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : 'All Products'}
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore our wide range of medicines and health products.
      </p>

      {/* Product Grid */}
      {medicines.length === 0 ? (
        <p className="text-center text-gray-600">No medicines found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center text-center">
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
                  <span className="mr-1">⭐ {medicine.average_rating.toFixed(1)}</span>
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
    </div>
  );
};

export default ProductsPage;
