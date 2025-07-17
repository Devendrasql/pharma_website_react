// src/components/CategoryProductSection.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useCart } from '../hooks/useCart.tsx';
import { Star, ShoppingCart } from 'lucide-react'; // Added ShoppingCart icon

interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_url?: string;
  in_stock: boolean;
  prescription_required: boolean;
  mrp?: number;
  discount_percentage?: number;
  average_rating?: number;
  total_reviews?: number;
}

interface CategoryProductSectionProps {
  categoryName: string; // The name of the category to display products for
  limit?: number; // Optional: number of products to show (default to 4 or 8)
}

const CategoryProductSection: React.FC<CategoryProductSectionProps> = ({ categoryName, limit = 4 }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  // First, fetch the category ID from its name
  useEffect(() => {
    const fetchCategoryId = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (error) throw error;
        if (data) {
          setCategoryId(data.id);
        } else {
          setError(`Category "${categoryName}" not found.`);
        }
      } catch (err: any) {
        console.error(`Error fetching ID for category ${categoryName}:`, err.message);
        setError(`Failed to load category "${categoryName}".`);
      }
    };
    fetchCategoryId();
  }, [categoryName]);

  // Then, fetch medicines using the category ID
  useEffect(() => {
    const fetchMedicines = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('*')
          .eq('category_id', categoryId)
          .limit(limit)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data);
      } catch (err: any) {
        console.error(`Error fetching medicines for ${categoryName}:`, err.message);
        setError(`Failed to load medicines for ${categoryName}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [categoryId, limit, categoryName]);

  const handleAddToCartClick = (medicineId: string) => {
    addToCart(medicineId, 1);
  };

  if (loading) {
    return <div className="text-center text-gray-600 py-4">Loading {categoryName} products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-4">{error}</div>;
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-600 py-4">No products found in {categoryName}.</p>;
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((medicine) => (
          <div key={medicine.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col relative overflow-hidden">
            {/* Discount Badge */}
            {medicine.discount_percentage && medicine.discount_percentage > 0 && (
              <span className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10">
                -{medicine.discount_percentage}%
              </span>
            )}

            <img
              src={medicine.image_url || `https://placehold.co/150x150/E0F2F7/000?text=${medicine.name}`}
              alt={medicine.name}
              className="w-full h-40 object-contain mx-auto mb-4 rounded-md"
            />
            <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">{medicine.name}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{medicine.description}</p>

            {/* Price Display */}
            <div className="flex items-center justify-center mb-2">
              {medicine.mrp && medicine.discount_percentage && medicine.discount_percentage > 0 ? (
                <>
                  <span className="text-gray-500 line-through text-sm mr-2">₹{medicine.mrp.toFixed(2)}</span>
                  <span className="text-blue-700 font-bold text-lg">₹{medicine.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-blue-700 font-bold text-lg">₹{medicine.price.toFixed(2)}</span>
              )}
            </div>

            {/* Star Rating */}
            {medicine.average_rating !== undefined && medicine.total_reviews !== undefined && (
              <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                <span className="mr-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.round(medicine.average_rating || 0) ? "currentColor" : "none"} stroke="currentColor" />
                  ))}
                </span>
                <span>({medicine.total_reviews} reviews)</span>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-auto flex flex-col space-y-2 w-full"> {/* mt-auto pushes buttons to bottom */}
              <button
                onClick={() => navigate(`/product/${medicine.id}`)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-semibold flex items-center justify-center space-x-2"
              >
                {medicine.prescription_required ? 'View Products' : 'View Details'} {/* Conditional text */}
              </button>
              <button
                onClick={() => handleAddToCartClick(medicine.id)}
                disabled={!medicine.in_stock}
                className={`w-full px-4 py-2 rounded-md font-semibold flex items-center justify-center space-x-2 ${
                  medicine.in_stock
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transition-colors'
                    : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={18} />
                <span>{medicine.in_stock ? 'Add To Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <button
          onClick={() => navigate(`/products/${categoryName.toLowerCase().replace(/\s+/g, '-')}`)}
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors"
        >
          View All {categoryName}
        </button>
      </div>
    </section>
  );
};

export default CategoryProductSection;
