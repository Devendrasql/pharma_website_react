import React, { useState } from 'react';
import { Heart, Activity, Calendar, MapPin, Clock } from 'lucide-react';

interface HealthPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  tests: string[];
  duration: string;
  fasting: boolean;
  homeCollection: boolean;
  reportTime: string;
}

export const HealthCheckup: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    preferredDate: '',
    preferredTime: ''
  });

  const healthPackages: HealthPackage[] = [
    {
      id: '1',
      name: 'Basic Health Checkup',
      description: 'Essential tests for overall health monitoring',
      price: 999,
      originalPrice: 1499,
      tests: ['Complete Blood Count', 'Blood Sugar', 'Lipid Profile', 'Liver Function', 'Kidney Function'],
      duration: '30 minutes',
      fasting: true,
      homeCollection: true,
      reportTime: '24 hours'
    },
    {
      id: '2',
      name: 'Comprehensive Health Package',
      description: 'Detailed health assessment with advanced tests',
      price: 2499,
      originalPrice: 3999,
      tests: ['Complete Blood Count', 'Diabetes Panel', 'Heart Health', 'Thyroid Profile', 'Vitamin Profile', 'Cancer Markers'],
      duration: '45 minutes',
      fasting: true,
      homeCollection: true,
      reportTime: '48 hours'
    },
    {
      id: '3',
      name: 'Senior Citizen Package',
      description: 'Specialized tests for age-related health concerns',
      price: 1899,
      originalPrice: 2799,
      tests: ['Bone Health', 'Heart Function', 'Diabetes Screening', 'Kidney Function', 'Eye Checkup'],
      duration: '60 minutes',
      fasting: true,
      homeCollection: true,
      reportTime: '24 hours'
    }
  ];

  const handleBooking = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const submitBooking = () => {
    alert('Booking confirmed! We will contact you shortly to schedule your health checkup.');
    setSelectedPackage(null);
    setBookingForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      preferredDate: '',
      preferredTime: ''
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-800">Health Checkup Packages</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive health screenings at your doorstep. Early detection for better health outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {healthPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-blue-100 text-sm">{pkg.description}</p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">₹{pkg.price}</span>
                    <span className="text-lg text-gray-500 line-through ml-2">₹{pkg.originalPrice}</span>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {Math.round((1 - pkg.price / pkg.originalPrice) * 100)}% OFF
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Activity className="h-4 w-4" />
                    <span>{pkg.tests.length} tests included</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {pkg.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{pkg.homeCollection ? 'Home collection available' : 'Lab visit required'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Report in {pkg.reportTime}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Tests Included:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {pkg.tests.slice(0, 3).map((test, index) => (
                      <li key={index}>• {test}</li>
                    ))}
                    {pkg.tests.length > 3 && (
                      <li className="text-blue-600">• +{pkg.tests.length - 3} more tests</li>
                    )}
                  </ul>
                </div>
                
                <button
                  onClick={() => handleBooking(pkg.id)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-xl font-semibold mb-4">Book Health Checkup</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({...bookingForm, preferredDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <select
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({...bookingForm, preferredTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      <option value="morning">Morning (8 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};