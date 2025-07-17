import React from 'react';
import { Tag, Clock, ArrowRight } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  image: string;
  category: string;
}

export const OffersBanner: React.FC = () => {
  const offers: Offer[] = [
    {
      id: '1',
      title: 'New Year Health Sale',
      description: 'Get up to 30% off on all vitamins and supplements',
      discount: '30% OFF',
      code: 'HEALTH30',
      validUntil: '2025-01-31',
      image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Vitamins'
    },
    {
      id: '2',
      title: 'Free Delivery Weekend',
      description: 'Free delivery on all orders above ₹299',
      discount: 'FREE DELIVERY',
      code: 'FREEDEL',
      validUntil: '2025-01-20',
      image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Delivery'
    },
    {
      id: '3',
      title: 'First Order Special',
      description: 'Extra 20% off on your first medicine order',
      discount: '20% OFF',
      code: 'FIRST20',
      validUntil: '2025-02-15',
      image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'New User'
    }
  ];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copied to clipboard!`);
  };

  return (
    <section className="py-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Special Offers & Deals</h2>
          <p className="text-blue-100">Save more on your health essentials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{offer.discount}</div>
                    <div className="text-blue-100 text-sm">{offer.category}</div>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Limited Time
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2">{offer.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="font-mono text-sm font-semibold text-blue-600">{offer.code}</span>
                  </div>
                  <button
                    onClick={() => copyCode(offer.code)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Copy Code
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <span>Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};