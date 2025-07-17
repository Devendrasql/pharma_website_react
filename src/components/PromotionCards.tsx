import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url: string;
  discount_percentage: number;
  discount_amount: number;
  promo_code: string;
  valid_until: string;
  min_order_amount: number;
}

export const PromotionCards: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Promo code ${code} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No active promotions at the moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {promotions.map((promotion) => (
        <div key={promotion.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
          <div className="relative">
            <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {promotion.discount_percentage > 0 
                    ? `${promotion.discount_percentage}% OFF`
                    : `₹${promotion.discount_amount} OFF`
                  }
                </div>
                <div className="text-blue-100 text-sm">Special Offer</div>
              </div>
            </div>
            <div className="absolute top-2 right-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Limited Time
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-gray-800 mb-2">{promotion.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{promotion.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-blue-600" />
                <span className="font-mono text-sm font-semibold text-blue-600">
                  {promotion.promo_code}
                </span>
              </div>
              <button
                onClick={() => copyPromoCode(promotion.promo_code)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Copy Code
              </button>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Valid until {new Date(promotion.valid_until).toLocaleDateString()}</span>
              </div>
            </div>
            
            {promotion.min_order_amount > 0 && (
              <p className="text-xs text-gray-500 mb-4">
                Minimum order: ₹{promotion.min_order_amount}
              </p>
            )}
            
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};