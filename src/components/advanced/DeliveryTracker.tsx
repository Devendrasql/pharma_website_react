import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

interface DeliveryStatus {
  id: string;
  status: 'ordered' | 'confirmed' | 'packed' | 'shipped' | 'delivered';
  timestamp: string;
  location?: string;
  description: string;
}

export const DeliveryTracker: React.FC = () => {
  const [trackingId, setTrackingId] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus[]>([]);
  const [isTracking, setIsTracking] = useState(false);

  const mockTrackOrder = (_id: string) => {
    setIsTracking(true);
    
    // Simulate API call
    setTimeout(() => {
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
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Order</h2>
      
      <div className="mb-6">
        <div className="flex space-x-3">
          <input
            type="text"
            placeholder="Enter your order ID (e.g., ORD123456)"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => mockTrackOrder(trackingId)}
            disabled={!trackingId || isTracking}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isTracking ? 'Tracking...' : 'Track Order'}
          </button>
        </div>
      </div>

      {deliveryStatus.length > 0 && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Order Status: In Transit</h3>
            <p className="text-blue-700 text-sm">Expected delivery: Tomorrow, 2:00 PM - 6:00 PM</p>
          </div>

          <div className="space-y-4">
            {deliveryStatus.map((status, index) => (
              <div key={status.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${getStatusColor(status.status)}`}>
                  {getStatusIcon(status.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 capitalize">
                      {status.status.replace('_', ' ')}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(status.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mt-1">{status.description}</p>
                  
                  {status.location && (
                    <div className="flex items-center space-x-1 mt-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{status.location}</span>
                    </div>
                  )}
                </div>
                
                {index < deliveryStatus.length - 1 && (
                  <div className="absolute left-6 mt-8 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h4 className="font-medium text-gray-800 mb-2">Delivery Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Delivery Partner:</span>
                <span className="ml-2 font-medium">Express Logistics</span>
              </div>
              <div>
                <span className="text-gray-600">Tracking ID:</span>
                <span className="ml-2 font-medium">{trackingId}</span>
              </div>
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
      )}
    </div>
  );
};