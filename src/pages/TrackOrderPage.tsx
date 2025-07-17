import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface DeliveryStatus {
  id: string;
  status: 'ordered' | 'confirmed' | 'packed' | 'shipped' | 'delivered';
  timestamp: string;
  location?: string;
  description: string;
}

export const TrackOrderPage: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [orderFound, setOrderFound] = useState(false);

  const mockTrackOrder = (id: string) => {
    setIsTracking(true);
    
    // Simulate API call
    setTimeout(() => {
      if (id.toLowerCase().includes('ord') || id.length >= 6) {
        setDeliveryStatus([
          {
            id: '1',
            status: 'ordered',
            timestamp: '2025-01-14T10:00:00Z',
            description: 'Order placed successfully',
            location: 'Mumbai, Maharashtra'
          },
          {
            id: '2',
            status: 'confirmed',
            timestamp: '2025-01-14T11:30:00Z',
            description: 'Order confirmed by pharmacy',
            location: 'Mumbai, Maharashtra'
          },
          {
            id: '3',
            status: 'packed',
            timestamp: '2025-01-14T14:00:00Z',
            description: 'Order packed and ready for dispatch',
            location: 'Mumbai, Maharashtra'
          },
          {
            id: '4',
            status: 'shipped',
            timestamp: '2025-01-14T16:00:00Z',
            description: 'Order shipped via Express Delivery',
            location: 'Mumbai, Maharashtra'
          }
        ]);
        setOrderFound(true);
      } else {
        setDeliveryStatus([]);
        setOrderFound(false);
      }
      setIsTracking(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ordered':
        return <Package className="h-5 w-5" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5" />;
      case 'packed':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-orange-600 bg-orange-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => {}} onAuthClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Track Your Order</h1>
            <p className="text-gray-600">Enter your order ID to get real-time updates on your delivery</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your order ID (e.g., ORD123456)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => mockTrackOrder(trackingId)}
                disabled={!trackingId || isTracking}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>{isTracking ? 'Tracking...' : 'Track Order'}</span>
              </button>
            </div>
          </div>

          {isTracking && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Tracking your order...</p>
            </div>
          )}

          {!isTracking && trackingId && !orderFound && deliveryStatus.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Order not found</h3>
              <p className="text-gray-600">Please check your order ID and try again</p>
            </div>
          )}

          {deliveryStatus.length > 0 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Order Status: In Transit
                </h3>
                <p className="text-blue-700">Expected delivery: Tomorrow, 2:00 PM - 6:00 PM</p>
                <p className="text-sm text-blue-600 mt-2">Order ID: {trackingId}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Delivery Timeline</h3>
                
                <div className="space-y-6">
                  {deliveryStatus.map((status, index) => (
                    <div key={status.id} className="flex items-start space-x-4 relative">
                      <div className={`p-3 rounded-full ${getStatusColor(status.status)}`}>
                        {getStatusIcon(status.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-800 capitalize">
                            {status.status.replace('_', ' ')}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(status.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{status.description}</p>
                        
                        {status.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{status.location}</span>
                          </div>
                        )}
                      </div>
                      
                      {index < deliveryStatus.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Delivery Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Delivery Partner:</span>
                      <span className="ml-2 font-medium">Express Logistics</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="ml-2 font-medium">{trackingId}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">Delivery Address:</span>
                      <span className="ml-2 font-medium">123 Main Street, Mumbai</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Contact:</span>
                      <span className="ml-2 font-medium">+91 98765 43210</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {deliveryStatus.length === 0 && !isTracking && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Track Your Order</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Find Your Order ID</h4>
                  <p className="text-sm text-gray-600">Check your email confirmation or SMS for the order ID</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Enter Order ID</h4>
                  <p className="text-sm text-gray-600">Type your order ID in the search box above</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Track in Real-time</h4>
                  <p className="text-sm text-gray-600">Get live updates on your order status and delivery</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};