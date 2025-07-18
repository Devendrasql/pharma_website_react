import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Shield,
  Truck,
  CreditCard,
  Award
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Trust Indicators */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-blue-400 mb-2" />
              <h4 className="font-semibold mb-1">100% Authentic</h4>
              <p className="text-sm text-gray-400">Genuine products only</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-green-400 mb-2" />
              <h4 className="font-semibold mb-1">Fast Delivery</h4>
              <p className="text-sm text-gray-400">Same day delivery available</p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-8 w-8 text-purple-400 mb-2" />
              <h4 className="font-semibold mb-1">Secure Payment</h4>
              <p className="text-sm text-gray-400">Multiple payment options</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-yellow-400 mb-2" />
              <h4 className="font-semibold mb-1">Licensed Pharmacy</h4>
              <p className="text-sm text-gray-400">Government approved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-xl">
                <div className="h-8 w-8 flex items-center justify-center font-bold text-xl">
                  H+
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">HealthMart</h3>
                <p className="text-sm text-gray-400">Your Trusted Pharmacy</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Your trusted online pharmacy providing quality medications and health products 
              with professional service across India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/category/all" className="text-gray-400 hover:text-white transition-colors">
                  All Medicines
                </Link>
              </li>
              <li>
                <Link to="/category/pain-relief" className="text-gray-400 hover:text-white transition-colors">
                  Pain Relief
                </Link>
              </li>
              <li>
                <Link to="/category/vitamins" className="text-gray-400 hover:text-white transition-colors">
                  Vitamins & Supplements
                </Link>
              </li>
              <li>
                <Link to="/category/beauty-care" className="text-gray-400 hover:text-white transition-colors">
                  Beauty Care
                </Link>
              </li>
              <li>
                <Link to="/category/baby-care" className="text-gray-400 hover:text-white transition-colors">
                  Baby Care
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-gray-400 hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/reminders" className="text-gray-400 hover:text-white transition-colors">
                  Medicine Reminders
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">+91 98765 43210</p>
                  <p className="text-gray-400">24/7 Customer Support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">info@healthmart.in</p>
                  <p className="text-gray-400">Email Support</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mumbai, Maharashtra</p>
                  <p className="text-gray-400">India</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">24/7 Service</p>
                  <p className="text-gray-400">Always Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; {currentYear} HealthMart India. All rights reserved.</p>
              <p className="mt-1">Licensed Pharmacy | Reg. No: DL-ABC-123456</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>We Accept:</span>
              <div className="flex items-center space-x-2">
                <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                  UPI
                </div>
                <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                  COD
                </div>
                <div className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                  Cards
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};