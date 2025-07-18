import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { Medicine, Category, SearchFilters } from '../types';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Medicine[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    fetchCategoryData();
  }, [categoryId, searchParams]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('medicines')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('in_stock', true);

      // Apply category filter
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
        
        // Fetch category info
        const { data: categoryData } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single();
        
        setCategory(categoryData);
      } else {
        setCategory({ id: 'all', name: 'All Products', description: 'Browse all available products', created_at: '' });
      }

      // Apply filters from URL params
      const priceMin = searchParams.get('priceMin');
      const priceMax = searchParams.get('priceMax');
      const manufacturer = searchParams.get('manufacturer');
      const prescriptionRequired = searchParams.get('prescription');
      const rating = searchParams.get('rating');
      const sort = searchParams.get('sort') || 'name';

      if (priceMin) query = query.gte('price', parseFloat(priceMin));
      if (priceMax) query = query.lte('price', parseFloat(priceMax));
      if (manufacturer) query = query.eq('manufacturer', manufacturer);
      if (prescriptionRequired) query = query.eq('prescription_required', prescriptionRequired === 'true');
      if (rating) query = query.gte('average_rating', parseFloat(rating));

      // Apply sorting
      setSortBy(sort);
      switch (sort) {
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    if (newFilters.priceRange) {
      params.set('priceMin', newFilters.priceRange[0].toString());
      params.set('priceMax', newFilters.priceRange[1].toString());
    }
    if (newFilters.manufacturer) params.set('manufacturer', newFilters.manufacturer);
    if (newFilters.prescriptionRequired !== undefined) {
      params.set('prescription', newFilters.prescriptionRequired.toString());
    }
    if (newFilters.rating) params.set('rating', newFilters.rating.toString());
    if (newFilters.sortBy) params.set('sort', newFilters.sortBy);

    setSearchParams(params);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    handleFilterChange({ ...filters, sortBy: sort });
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
      
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {category?.name}
            </h1>
            {category?.description && (
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {products.length} products found
              </span>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0"
            >
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                products={products}
              />
            </motion.div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard 
                      product={product} 
                      className={viewMode === 'list' ? 'flex-row' : ''}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};