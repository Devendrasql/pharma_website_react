import React, { useState, useEffect } from 'react';
import { Tag, Clock, ArrowRight, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  promo_code: string;
  valid_until: string;
  min_order_amount: number;
}

export const PromotionBanner: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromo((prev) => (prev + 1) % promotions.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  if (!showBanner || promotions.length === 0) return null;

  const promotion = promotions[currentPromo];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 11.046-8.954 20-20 20v-40c11.046 0 20 8.954 20 20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container mx-auto px-4 py-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Tag className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <h3 className="font-bold text-lg">{promotion.title}</h3>
                    <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                      {promotion.discount_percentage 
                        ? `${promotion.discount_percentage}% OFF`
                        : `₹${promotion.discount_amount} OFF`
                      }
                    </span>
                  </div>
                  <p className="text-orange-100 text-sm">{promotion.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm text-orange-100">Use Code</div>
                  <button
                    onClick={() => copyPromoCode(promotion.promo_code)}
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition-colors"
                  >
                    {promotion.promo_code}
                  </button>
                </div>

                <div className="flex items-center space-x-2 text-sm text-orange-100">
                  <Clock className="h-4 w-4" />
                  <span>Ends {new Date(promotion.valid_until).toLocaleDateString()}</span>
                </div>

                <button
                  onClick={() => setShowBanner(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Promotion Indicators */}
            {promotions.length > 1 && (
              <div className="flex justify-center space-x-2 mt-3">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPromo(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPromo ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};