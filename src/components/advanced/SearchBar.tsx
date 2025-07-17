import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { Medicine } from '../../types';
import { supabase } from '../../lib/supabase';

interface SearchBarProps {
  onSearch: (term: string) => void;
  searchTerm: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchTerm }) => {
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length > 1) {
        const { data } = await supabase
          .from('medicines')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,active_ingredient.ilike.%${searchTerm}%`)
          .limit(5);
        
        setSuggestions(data || []);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    onSearch(term);
    setShowSuggestions(false);
    
    // Save to recent searches
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const popularSearches = ['Paracetamol', 'Vitamin D', 'Blood Pressure', 'Diabetes', 'Cold Medicine'];

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search for medicines, health products, or symptoms..."
          className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-lg"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
        />
      </div>

      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 max-h-96 overflow-y-auto">
          {suggestions.length > 0 && (
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Suggestions</h4>
              {suggestions.map((medicine) => (
                <button
                  key={medicine.id}
                  onClick={() => handleSearch(medicine.name)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-gray-500">{medicine.manufacturer}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {recentSearches.length > 0 && (
            <div className="p-4 border-t">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Recent Searches
              </h4>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-gray-700"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          <div className="p-4 border-t">
            <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              Popular Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => handleSearch(search)}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};