// src/pages/OrderHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Correct path to supabaseClient

// Define interfaces based on your Supabase schema
interface Medicine {
  id: string;
  name: string;
  image_url?: string;
  // Add other fields you need from the medicines table for display
}

interface OrderItem {
  id: string;
  order_id: string; // Ensure this is selected
  medicine_id: string; // Ensure this is selected
  quantity: number;
  price: number;
  created_at: string; // Ensure this is selected
  medicines: Medicine; // Nested medicine details
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped';
  customer_info: any; // jsonb type, adjust as needed
  prescription_file_url?: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[]; // Nested order items
}

const OrderHistoryPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return; // Do not fetch if user is not logged in
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch orders and join with order_items and then with medicines
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            user_id,
            total_amount,
            status,
            customer_info,
            prescription_file_url,
            created_at,
            updated_at,
            order_items (
              id,
              order_id,
              medicine_id,
              quantity,
              price,
              created_at,
              medicines (
                id,
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }); // Latest orders first

        if (error) throw error;
        setOrders(data as Order[]); // Type assertion
      } catch (err: any) {
        console.error("Error fetching orders:", err.message);
        setError("Failed to load order history.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) { // Only fetch if auth is done and user is present
      fetchOrders();
    } else if (!authLoading && !user) {
      // If auth is done and no user, navigate to home (or login)
      navigate('/');
    }
  }, [user, authLoading, navigate]); // Re-run when user or authLoading state changes

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading order history...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!user) {
    // This case is handled by the useEffect redirect, but good for initial render safety
    return <div className="text-center py-10 text-gray-600">Please log in to view your order history.</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">My Order History</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">You have no past orders.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-blue-700">Order ID: {order.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'pending' || order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800' // For cancelled
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-gray-800 mb-3">Total: ₹{order.total_amount.toFixed(2)}</p>

                {order.order_items && order.order_items.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-semibold text-gray-700 mb-2">Items:</h4>
                    <ul className="space-y-2">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex items-center space-x-3">
                          {item.medicines?.image_url && (
                            <img
                              src={item.medicines.image_url}
                              alt={item.medicines?.name || 'Item'}
                              className="w-10 h-10 object-contain rounded-md"
                            />
                          )}
                          <div>
                            <p className="text-gray-700">{item.medicines?.name || 'Unknown Medicine'} x {item.quantity}</p>
                            <p className="text-sm text-gray-500">₹{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                 {order.prescription_file_url && (
                  <div className="mt-4">
                    <a
                      href={order.prescription_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Prescription
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
