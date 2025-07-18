import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { Medicine } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { displayPrice } from '../../utils/currency';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Medicine;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    if (!product.in_stock) {
      toast.error('Product is out of stock');
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(product.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add to wishlist');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const discountPercentage = product.mrp && product.price < product.mrp 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : product.discount_percentage || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group ${className}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={product.image_url || '/placeholder-medicine.jpg'}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {discountPercentage}% OFF
              </span>
            )}
            {product.prescription_required && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Rx Required
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-lg transition-colors ${
                isWishlisted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart className="h-4 w-4" />
            </button>
            <button className="p-2 bg-white text-gray-600 hover:text-blue-600 rounded-full shadow-lg transition-colors">
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Stock Status */}
          <div className="absolute bottom-3 left-3">
            {product.in_stock ? (
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <CheckCircle className="h-3 w-3" />
                <span>In Stock</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                <AlertCircle className="h-3 w-3" />
                <span>Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-gray-800 mt-1 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Manufacturer & Dosage */}
          <div className="text-sm text-gray-600 mb-3">
            <p className="truncate">{product.manufacturer}</p>
            {product.dosage && (
              <p className="text-xs text-gray-500">{product.dosage}</p>
            )}
          </div>

          {/* Rating */}
          {product.average_rating && product.average_rating > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex">
                {renderStars(product.average_rating)}
              </div>
              <span className="text-sm text-gray-600">
                ({product.total_reviews || 0})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-800">
                {displayPrice(product.price)}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {displayPrice(product.mrp)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || isLoading}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              product.in_stock
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
              </>
            )}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};