import React from 'react';
import { Heart, Activity, Stethoscope, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthServices: React.FC = () => {
  const services = [
    {
      icon: Heart,
      title: 'Health Checkups',
      description: 'Comprehensive health packages at your doorstep',
      features: ['Full Body Checkup', 'Blood Tests', 'ECG & X-Ray', 'Doctor Consultation'],
      color: 'from-red-500 to-pink-500',
      price: 'Starting ₹999'
    },
    {
      icon: Activity,
      title: 'Lab Tests',
      description: 'Accurate diagnostic tests with quick results',
      features: ['Blood Sugar', 'Lipid Profile', 'Thyroid Tests', 'Vitamin Levels'],
      color: 'from-blue-500 to-cyan-500',
      price: 'Starting ₹299'
    },
    {
      icon: Stethoscope,
      title: 'Doctor Consultation',
      description: 'Expert medical advice from certified doctors',
      features: ['Video Consultation', 'Prescription Review', 'Follow-up Care', '24/7 Support'],
      color: 'from-green-500 to-emerald-500',
      price: 'Starting ₹199'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4"
          >
            Health Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Complete healthcare solutions delivered to your home
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 group"
            >
              <div className={`bg-gradient-to-br ${service.color} p-6 text-white relative`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <service.icon className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/90 text-sm">{service.description}</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">{service.price}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <MapPin className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Home Sample Collection</h4>
              <p className="text-gray-600 text-sm">Trained phlebotomists visit your home for sample collection</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <Clock className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Quick Reports</h4>
              <p className="text-gray-600 text-sm">Get your test results within 24-48 hours via email/SMS</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <Calendar className="h-8 w-8 text-purple-600 mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Easy Scheduling</h4>
              <p className="text-gray-600 text-sm">Book appointments at your convenient time slot</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};