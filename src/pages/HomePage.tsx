import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { PromotionBanner } from '../components/home/PromotionBanner';
import { HealthServices } from '../components/home/HealthServices';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { FloatingCart } from '../components/cart/FloatingCart';
import { supabase } from '../lib/supabase';
import { Medicine, Category } from '../types';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch featured products
      const { data: medicines, error: medicinesError } = await supabase
        .from('medicines')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('in_stock', true)
        .order('average_rating', { ascending: false })
        .limit(8);

      if (medicinesError) throw medicinesError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setFeaturedProducts(medicines || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <PromotionBanner />
        <CategoryGrid categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <HealthServices />
        <TestimonialSection />
        <NewsletterSection />
      </main>

      <Footer />
      <FloatingCart />
    </div>
  );
};