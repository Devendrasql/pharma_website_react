// src/components/HeroSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-blue-100 py-16 md:py-24 overflow-hidden rounded-lg shadow-lg mx-auto container">
      {/* Background Image/Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-transparent opacity-80" aria-hidden="true"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white text-center md:text-left">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
          Your Health, Our Priority.
          <br />
          Online Pharmacy at Your Fingertips.
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 drop-shadow-md">
          Get genuine medicines, health products, and expert advice delivered safely to your home.
        </p>
        <button
          onClick={() => navigate('/products/all')}
          className="bg-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-600 transition-colors duration-300 transform hover:scale-105"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
