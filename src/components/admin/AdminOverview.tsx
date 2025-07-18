import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { displayPrice } from '../../utils/currency';

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true });

      // Fetch orders count and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, status');

      // Fetch users count (this would need a users table or auth users access)
      const { count: usersCount } = await supabase
        .from('orders')
        .select('user_id', { count: 'exact', head: true });

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;
      const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: orders?.length || 0,
        totalUsers: usersCount || 0,
        totalRevenue,
        pendingOrders,
        lowStockProducts: 0 // This would need inventory tracking
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Total Revenue',
      value: displayPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-orange-500',
      change: '+23%'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Activity,
      color: 'bg-red-500',
      change: '-5%'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      change: '+2%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
                <p className="text-green-600 text-sm mt-1">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium text-blue-800">Add New Product</div>
              <div className="text-sm text-blue-600">Add medicines to inventory</div>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium text-green-800">Process Orders</div>
              <div className="text-sm text-green-600">Review pending orders</div>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium text-purple-800">View Analytics</div>
              <div className="text-sm text-purple-600">Check sales reports</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">New order received</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Product added to inventory</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Low stock alert</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};