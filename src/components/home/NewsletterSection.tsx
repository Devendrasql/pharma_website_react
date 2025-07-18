import React, { useState } from 'react';
import { Mail, Send, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setLoading(false);
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Mail className="h-8 w-8" />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Stay Updated with Health Tips
            </h2>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Subscribe to our newsletter and get the latest health tips, medicine information, 
              and exclusive offers delivered to your inbox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-white/20 rounded-xl p-6 flex items-center justify-center space-x-3">
                <Check className="h-6 w-6 text-green-300" />
                <span className="text-lg font-medium">Thank you for subscribing!</span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Weekly</div>
              <div className="text-blue-100 text-sm">Health Tips & Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Exclusive</div>
              <div className="text-blue-100 text-sm">Offers & Discounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Latest</div>
              <div className="text-blue-100 text-sm">Medicine Information</div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-blue-200 text-sm"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </div>
      </div>
    </section>
  );
};