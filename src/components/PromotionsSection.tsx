// src/components/PromotionsSection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Promotion {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  promo_code?: string;
  valid_from: string;
  valid_until?: string;
  is_active: boolean;
  category_id?: string;
  min_order_amount?: number;
  max_discount_amount?: number;
  // Add other fields as per your promotions schema
}

const PromotionsSection: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .gte('valid_until', new Date().toISOString()) // Only active and not expired
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPromotions(data);
      } catch (err: any) {
        console.error("Error fetching promotions:", err.message);
        setError("Failed to load promotions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading promotions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (promotions.length === 0) {
    return null; // Don't render section if no promotions
  }

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">Special Offers & Promotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row items-center hover:shadow-xl transition-shadow duration-300"
          >
            {promo.image_url && (
              <img
                src={promo.image_url}
                alt={promo.title}
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />
            )}
            <div className="p-6 flex-grow text-center md:text-left">
              <h3 className="text-xl font-bold text-blue-700 mb-2">{promo.title}</h3>
              <p className="text-gray-700 text-sm mb-3 line-clamp-3">{promo.description}</p>
              {promo.discount_percentage && (
                <span className="inline-block bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">
                  {promo.discount_percentage}% OFF
                </span>
              )}
              {promo.promo_code && (
                <p className="text-gray-800 font-bold text-lg mb-3">Code: <span className="text-blue-600">{promo.promo_code}</span></p>
              )}
              <button
                onClick={() => navigate('/products/all')} // Link to products or specific category
                className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromotionsSection;
