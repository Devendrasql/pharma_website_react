// src/components/TestimonialsSection.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Star, Quote } from 'lucide-react'; // Quote icon for testimonials

interface Review {
  id: string;
  user_id: string; // Keep user_id in interface
  medicine_id: string; // Ensure this is selected
  rating: number;
  title?: string;
  comment?: string;
  verified_purchase: boolean;
  created_at: string; // Ensure this is selected
  // users?: { email: string }; // Temporarily removed from interface for troubleshooting
  medicines?: { name: string }; // Join with medicines for product name
}

const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error: supabaseError } = await supabase // Renamed error to supabaseError
          .from('reviews')
          .select(`
            id,
            user_id,
            medicine_id,
            rating,
            title,
            comment,
            verified_purchase,
            created_at,
            medicines (name)
          `)
          .order('created_at', { ascending: false })
          .limit(6); // Limit to show a few testimonials

        if (supabaseError) {
          console.error("Supabase error fetching testimonials:", supabaseError); // Log the full error object
          throw new Error(`Supabase Error: ${supabaseError.message} (Code: ${supabaseError.code})`);
        }
        setReviews(data as Review[]);
      } catch (err: any) {
        console.error("Overall error fetching testimonials:", err); // Log the caught error
        setError("Failed to load testimonials. Details: " + err.message); // Provide more detail to UI
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading testimonials...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  if (reviews.length === 0) {
    return null; // Don't render section if no testimonials
  }

  return (
    <section className="container mx-auto px-4 py-12 bg-blue-50 rounded-lg shadow-inner">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-md relative">
            <Quote size={40} className="text-blue-200 absolute top-4 left-4 opacity-50" />
            <div className="flex items-center mb-3">
              <span className="flex items-center text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} stroke="currentColor" />
                ))}
              </span>
              <span className="text-sm text-gray-600">
                {review.rating} / 5
              </span>
            </div>
            {review.title && <h3 className="font-semibold text-lg text-gray-800 mb-2">{review.title}</h3>}
            {review.comment && <p className="text-gray-700 text-sm italic line-clamp-4">"{review.comment}"</p>}
            <p className="text-right text-sm font-medium text-blue-700 mt-4">
              - {review.user_id ? 'Anonymous User' : 'Anonymous'}
            </p>
            {review.medicines?.name && (
              <p className="text-right text-xs text-gray-500">
                on <span className="font-semibold">{review.medicines.name}</span>
              </p>
            )}
            {review.verified_purchase && (
              <span className="absolute bottom-4 left-4 text-green-600 text-xs font-semibold">Verified Purchase</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
