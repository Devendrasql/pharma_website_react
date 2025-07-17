// src/components/WhyChooseUs.tsx
import React from 'react';
import { ShieldCheck, Truck, Headset, DollarSign } from 'lucide-react'; // Example icons

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={40} className="text-blue-600 mb-4" />,
      title: '100% Genuine Medicines',
      description: 'We guarantee authenticity and quality for all our products.',
    },
    {
      icon: <Truck size={40} className="text-blue-600 mb-4" />,
      title: 'Fast & Reliable Delivery',
      description: 'Get your orders delivered quickly and safely to your doorstep.',
    },
    {
      icon: <Headset size={40} className="text-blue-600 mb-4" />,
      title: '24/7 Customer Support',
      description: 'Our dedicated team is always here to assist you.',
    },
    {
      icon: <DollarSign size={40} className="text-blue-600 mb-4" />,
      title: 'Best Prices & Offers',
      description: 'Enjoy competitive pricing and exciting discounts on every purchase.',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">Why Choose PharmaCare?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
            {feature.icon}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
