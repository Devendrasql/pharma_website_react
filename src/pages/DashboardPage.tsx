// src/pages/DashboardPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx'; // Corrected path to .tsx

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (!user) {
    // Redirect to home or login if not authenticated
    navigate('/');
    return null; // Or show a message
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Welcome, {user.email}!</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-4">
          This is your personal dashboard. From here you can manage your profile, view your orders, and more.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate('/dashboard/orders')}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
