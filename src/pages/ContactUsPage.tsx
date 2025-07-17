// src/pages/ContactUsPage.tsx
import React from 'react';

const ContactUsPage: React.FC = () => {
  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">Contact Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
        <p className="text-lg text-gray-700 mb-4">
          Have questions or need assistance? Feel free to reach out to us!
        </p>
        <ul className="text-gray-700 space-y-2 mb-6">
          <li><strong>Email:</strong> support@pharmacare.com</li>
          <li><strong>Phone:</strong> 1800-123-4567</li>
          <li><strong>Address:</strong> 123 Health Lane, Wellness City, State, 12345</li>
        </ul>
        <p className="text-lg text-gray-700">
          We are available Monday to Friday, 9 AM to 6 PM.
        </p>
      </div>
    </div>
  );
};

export default ContactUsPage;
