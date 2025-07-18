import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchFilters, Medicine } from '../../types';
import { displayPrice } from '../../utils/currency';

interface ProductFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  products: Medicine[];
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  products
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    manufacturer: true,
    prescription: true,
    rating: true,
  });

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique manufacturers from products
    const uniqueManufacturers = [...new Set(products.map(p => p.manufacturer).filter(Boolean))];
    setManufacturers(uniqueManufacturers);

    // Set price range based on products
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: [min, max]
    });
  };

  const handleManufacturerChange = (manufacturer: string) => {
    onFilterChange({
      ...filters,
      manufacturer: filters.manufacturer === manufacturer ? undefined : manufacturer
    });
  };

  const handlePrescriptionChange = (required: boolean) => {
    onFilterChange({
      ...filters,
      prescriptionRequired: filters.prescriptionRequired === required ? undefined : required
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
          >
            <span>Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) => {
                    const min = parseFloat(e.target.value) || 0;
                    handlePriceChange(min, filters.priceRange?.[1] || priceRange[1]);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) => {
                    const max = parseFloat(e.target.value) || priceRange[1];
                    handlePriceChange(filters.priceRange?.[0] || priceRange[0], max);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              
              <div className="text-xs text-gray-500">
                Range: {displayPrice(priceRange[0])} - {displayPrice(priceRange[1])}
              </div>
            </div>
          )}
        </div>

        {/* Manufacturer */}
        <div>
          <button
            onClick={() => toggleSection('manufacturer')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
          >
            <span>Manufacturer</span>
            {expandedSections.manufacturer ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.manufacturer && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {manufacturers.map((manufacturer) => (
                <label key={manufacturer} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.manufacturer === manufacturer}
                    onChange={() => handleManufacturerChange(manufacturer)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{manufacturer}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Prescription Required */}
        <div>
          <button
            onClick={() => toggleSection('prescription')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
          >
            <span>Prescription</span>
            {expandedSections.prescription ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.prescription && (
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.prescriptionRequired === false}
                  onChange={() => handlePrescriptionChange(false)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Over the Counter</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.prescriptionRequired === true}
                  onChange={() => handlePrescriptionChange(true)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Prescription Required</span>
              </label>
            </div>
          )}
        </div>

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full text-left font-medium text-gray-800 mb-3"
          >
            <span>Customer Rating</span>
            {expandedSections.rating ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">& above</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};