import React, { useState } from 'react';
import { Clock, Repeat, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { displayPrice } from '../../utils/currency';

interface PreviousOrder {
  id: string;
  date: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  total: number;
}

export const QuickOrderRefill: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const previousOrders: PreviousOrder[] = [
    {
      id: 'ORD001',
      date: '2025-01-10',
      total: 450,
      items: [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          price: 75,
          quantity: 2,
          image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'
        },
        {
          id: '2',
          name: 'Vitamin D3 1000IU',
          price: 135,
          quantity: 1,
          image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
      ]
    },
    {
      id: 'ORD002',
      date: '2025-01-05',
      total: 320,
      items: [
        {
          id: '3',
          name: 'Multivitamin Complex',
          price: 190,
          quantity: 1,
          image: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500'
        }
      ]
    }
  ];

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleReorder = async () => {
    if (!user) return;

    for (const order of previousOrders) {
      for (const item of order.items) {
        if (selectedItems.includes(item.id)) {
          await addToCart(item.id, item.quantity);
        }
      }
    }
    
    setSelectedItems([]);
    alert('Selected items added to cart!');
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Reorder</h3>
        <p className="text-gray-600 mb-4">Sign in to see your previous orders and reorder with one click</p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Quick Reorder</h2>
        <Repeat className="h-6 w-6 text-blue-600" />
      </div>

      <div className="space-y-6">
        {previousOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()} • {displayPrice(order.total)}
                </p>
              </div>
              <button
                onClick={() => {
                  const orderItemIds = order.items.map(item => item.id);
                  setSelectedItems(prev => 
                    orderItemIds.every(id => prev.includes(id))
                      ? prev.filter(id => !orderItemIds.includes(id))
                      : [...prev, ...orderItemIds.filter(id => !prev.includes(id))]
                  );
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {order.items.every(item => selectedItems.includes(item.id)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{displayPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </p>
              <p className="text-sm text-blue-600">Ready to add to cart</p>
            </div>
            <button
              onClick={handleReorder}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};