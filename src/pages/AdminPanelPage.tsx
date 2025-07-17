// src/pages/AdminPanelPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Define interfaces for Admin view
interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  // Add other profile fields if you have a 'profiles' table
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  users?: { email: string }; // For joining with auth.users
}

interface Medicine {
  created_at: string | number | Date;
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
  // Add other relevant fields
}

const AdminPanelPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Basic check for admin role (replace with actual role-based access control)
  // For now, only 'admin@example.com' is considered admin.
  const isAdmin = user && user.email === 'admin@example.com';

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setError(null);
      try {
        // Fetch all users (only accessible by admin with proper RLS)
        const { data: usersData, error: usersError } = await supabase
          .from('users') // Note: Supabase auth.users table is usually accessed differently for full list
          .select('id, email, created_at'); // You might need a custom function/view for this in Supabase
                                            // For now, this might only return the current user or fail RLS.
                                            // A common pattern is a separate 'profiles' table with RLS for admins.
        if (usersError) console.error("Error fetching users:", usersError.message);
        setUsers(usersData || []);

        // Fetch all orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            id,
            user_id,
            total_amount,
            status,
            created_at,
            users(email) // Join with auth.users to get user email
          `)
          .order('created_at', { ascending: false });
        if (ordersError) throw ordersError;
        setOrders(ordersData as unknown as Order[]);

        // Fetch all medicines
        const { data: medicinesData, error: medicinesError } = await supabase
          .from('medicines')
          .select('id, name, price, in_stock, created_at')
          .order('created_at', { ascending: false });
        if (medicinesError) throw medicinesError;
        setMedicines(medicinesData || []);

      } catch (err: any) {
        console.error("Error fetching admin data:", err.message);
        setError("Failed to load admin data.");
      } finally {
        setLoadingData(false);
      }
    };

    if (!authLoading && user && isAdmin) {
      fetchData();
    } else if (!authLoading && (!user || !isAdmin)) {
      navigate('/'); // Redirect if not authenticated or not admin
    }
  }, [user, isAdmin, authLoading, navigate]);

  if (authLoading || loadingData) {
    return <div className="text-center py-10 text-gray-600">Loading admin panel...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!user || !isAdmin) {
    return <div className="text-center py-10 text-red-600">Access Denied. You must be an administrator to view this page.</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Admin Panel</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <p className="text-lg text-gray-700 mb-8">
          Welcome to the administrator dashboard. Manage your pharmacy's data here.
        </p>

        {/* Medicines Management */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6 mt-6">Medicines Overview</h2>
        {medicines.length === 0 ? (
          <p className="text-gray-600">No medicines found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Price</th>
                  <th className="py-2 px-4 border-b text-left">In Stock</th>
                  <th className="py-2 px-4 border-b text-left">Created At</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{med.name}</td>
                    <td className="py-2 px-4 border-b">₹{med.price.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{med.in_stock ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border-b">{new Date(med.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          onClick={() => alert('Add New Medicine functionality')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Add New Medicine
        </button>


        {/* Orders Management */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6 mt-6">All Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Order ID</th>
                  <th className="py-2 px-4 border-b text-left">User Email</th>
                  <th className="py-2 px-4 border-b text-left">Total</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{order.id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b">{order.users?.email || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">₹{order.total_amount.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">{order.status}</td>
                    <td className="py-2 px-4 border-b">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-blue-600 hover:underline text-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Management */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6 mt-6">All Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-600">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">User ID</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Joined At</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{u.id.substring(0, 8)}...</td>
                    <td className="py-2 px-4 border-b">{u.email}</td>
                    <td className="py-2 px-4 border-b">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
