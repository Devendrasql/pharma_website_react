// src/components/FeaturedCategories.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons

interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  icon_name?: string;
}

const FeaturedCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, description, image_url, icon_name');

        if (error) throw error;
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching featured categories:", err.message);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getLucideIcon = (iconName: string | undefined) => {
    if (!iconName) return null;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent size={48} className="text-blue-600 mb-4" /> : null;
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Shop By Category</h2>
      {categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/products/${category.name.toLowerCase().replace(/\s+/g, '-')}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-center p-4 text-center"
            >
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-24 h-24 object-cover mb-4 rounded-full border border-gray-200 p-2"
                />
              ) : (
                getLucideIcon(category.icon_name || 'HelpCircle') // Fallback to HelpCircle if no image or icon_name
              )}
              <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{category.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedCategories;
