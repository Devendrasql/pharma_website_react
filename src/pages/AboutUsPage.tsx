// src/pages/AboutUsPage.tsx
import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">About Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-4">
          Welcome to PharmaCare, your trusted partner in health and wellness. We are committed to providing
          high-quality medicines and health products to your doorstep with convenience and care.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Our mission is to make healthcare accessible and affordable for everyone. We source our products
          from reputable manufacturers and ensure strict quality control.
        </p>
        <p className="text-lg text-gray-700">
          Thank you for choosing PharmaCare for your health needs.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
