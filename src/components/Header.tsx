// import React from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// // import { useNavigate } from 'react-router-dom';

// import { ShoppingCart, Phone, MapPin, User, LogOut } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
// import { useCart } from '../hooks/useCart';

// interface HeaderProps {
//   onCartClick: () => void;
//   onAuthClick: () => void;
// }

// export const Header: React.FC<HeaderProps> = ({ 
//   onCartClick,
//   onAuthClick
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { user, signOut } = useAuth();
//   const { itemCount } = useCart();

//   const handleSignOut = async () => {
//     await signOut();
//   };

//   return (
//     <header className="bg-white shadow-lg sticky top-0 z-50">
//       {/* Top bar */}
//       <div className="bg-blue-600 text-white py-2">
//         <div className="container mx-auto px-4 flex justify-between items-center text-sm">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-1">
//               <Phone className="h-4 w-4" />
//               <span>+91 98765 43210</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <MapPin className="h-4 w-4" />
//               <span>Mumbai, Maharashtra, India</span>
//             </div>
//           </div>
//           <div className="flex items-center space-x-4">
//             {user ? (
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-1">
//                   <User className="h-4 w-4" />
//                   <span>{user.email}</span>
//                 </div>
//                 <button
//                   onClick={() => navigate('/orders')}
//                   className="flex items-center space-x-1 hover:text-blue-200"
//                 >
//                   <span>My Orders</span>
//                 </button>
//                 <button
//                   onClick={handleSignOut}
//                   className="flex items-center space-x-1 hover:text-blue-200"
//                 >
//                   <LogOut className="h-4 w-4" />
//                   <span>Sign Out</span>
//                 </button>
//               </div>
//             ) : (
//               <button
//                 onClick={onAuthClick}
//                 className="flex items-center space-x-1 hover:text-blue-200"
//               >
//                 <User className="h-4 w-4" />
//                 <span>Login / Register</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main header */}
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//             <button onClick={() => navigate('/')} className="flex items-center space-x-2">
//             <div className="bg-blue-600 text-white p-2 rounded-lg">
//               <div className="h-8 w-8 flex items-center justify-center font-bold text-lg">
//                 Rx
//               </div>
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">HealthMart</h1>
//               <p className="text-sm text-gray-600">Your Trusted Pharmacy</p>
//             </div>
//             </button>
//           </div>

//           {/* Navigation Links */}
//           <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
//             <button 
//               onClick={() => navigate('/')}
//               className={`font-medium transition-colors ${
//                 location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Medicines
//             </button>
//             <button 
//               onClick={() => navigate('/reminders')}
//               className={`font-medium transition-colors ${
//                 location.pathname === '/reminders' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Medicine Reminders
//             </button>
//             <button 
//               onClick={() => navigate('/track-order')}
//               className={`font-medium transition-colors ${
//                 location.pathname === '/track-order' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Track Order
//             </button>
//             <a href="#health-checkup" className="text-gray-700 hover:text-blue-600 font-medium">Health Checkup</a>
//             <a href="#articles" className="text-gray-700 hover:text-blue-600 font-medium">Health Articles</a>
//           </div>

//           {/* Mobile Menu & Cart */}
//           <div className="flex items-center space-x-2">
//             {/* Mobile Menu Button */}
//             <div className="lg:hidden">
//               <button className="p-2 text-gray-700 hover:text-blue-600">
//                 <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               </button>
//             </div>
            
//             {/* Cart */}
//             <button
//               onClick={onCartClick}
//               className="bg-blue-600 text-white px-4 lg:px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 relative"
//             >
//               <ShoppingCart className="h-5 w-5" />
//               <span className="hidden sm:inline font-medium">Cart</span>
//               {itemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
//                   {itemCount}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Navigation */}
//         <div className="lg:hidden mt-4 border-t pt-4">
//           <div className="flex flex-wrap gap-4 justify-center">
//             <button 
//               onClick={() => navigate('/')}
//               className={`text-sm font-medium transition-colors ${
//                 location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Medicines
//             </button>
//             <button 
//               onClick={() => navigate('/reminders')}
//               className={`text-sm font-medium transition-colors ${
//                 location.pathname === '/reminders' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Reminders
//             </button>
//             <button 
//               onClick={() => navigate('/track-order')}
//               className={`text-sm font-medium transition-colors ${
//                 location.pathname === '/track-order' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
//               }`}
//             >
//               Track Order
//             </button>
//             <a href="#health-checkup" className="text-sm text-gray-700 hover:text-blue-600 font-medium">Health Checkup</a>
//             <a href="#articles" className="text-sm text-gray-700 hover:text-blue-600 font-medium">Health Articles</a>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Phone, MapPin, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useCart } from '../hooks/useCart.tsx';
import { supabase } from '../supabaseClient'; // Import Supabase client

// Define the interface for a Category based on your schema - UPDATED
interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  icon_name?: string; // New: for Lucide icon name
  image_url?: string; // New: for category image
}

// Define props interface for Header component
interface HeaderProps {
  setIsCartOpen: (isOpen: boolean) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ setIsCartOpen, setIsAuthModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State to store live categories

  // Fetch categories from Supabase on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, description, created_at, icon_name, image_url'); // Select new columns

        if (error) throw error;
        setCategories(data);
      } catch (error: any) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures this runs once on mount

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard/profile');
      setIsMobileMenuOpen(false);
    } else {
      setIsAuthModalOpen(true);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (categoryName: string) => {
    // Navigate to /products/:categoryName (e.g., /products/pain-relief)
    navigate(`/products/${categoryName.toLowerCase().replace(/\s+/g, '-')}`);
    setIsCategoryMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Top Bar - Contact Info & Store Location */}
      <div className="bg-gray-100 py-2 text-sm text-gray-600 hidden md:block">
        <div className="container mx-auto px-4 flex justify-end space-x-6">
          <div className="flex items-center">
            <Phone size={16} className="mr-1 text-blue-600" />
            <span>Call Us: 1800-123-4567</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-1 text-blue-600" />
            <span>Find a Store</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap">
        {/* Logo/Site Title */}
        <div
          className="text-3xl font-extrabold text-blue-700 cursor-pointer hover:text-blue-800 transition-colors"
          onClick={() => navigate('/')}
        >
          PharmaCare
        </div>

        {/* Search Bar (Desktop View) */}
        <div className="hidden md:flex flex-grow max-w-xl mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for medicines & health products..."
              className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>

        {/* Desktop Right-side Icons (User/Login, Cart) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* User/Login/Logout Section */}
          <div className="relative group">
            <button
              onClick={handleAuthClick}
              className="flex items-center text-gray-700 hover:text-blue-700 cursor-pointer transition-colors p-2 rounded-md"
            >
              <User size={20} className="mr-2" />
              <span className="text-sm font-medium">{user ? user.email : 'Login / Register'}</span>
            </button>
            {user && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200 invisible">
                <a
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </a>
                <a
                  href="/dashboard/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon with Item Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center text-gray-700 hover:text-blue-700 cursor-pointer transition-colors p-2 rounded-md"
          >
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Button (Hamburger/X icon) */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-blue-700 p-2 rounded-md">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop View) */}
      <nav className="bg-blue-700 hidden md:block py-2">
        <div className="container mx-auto px-4">
          <ul className="flex justify-start space-x-8">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className="text-white hover:text-blue-200 transition-colors duration-200 text-sm font-medium p-2 rounded-md"
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg py-4 px-4 absolute w-full z-40">
          {/* Mobile Search Bar */}
          <div className="mb-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {/* User/Login/Logout for Mobile */}
            <div className="border-b pb-4 mb-4">
              <div className="relative group">
                <button
                  onClick={handleAuthClick}
                  className="flex items-center text-gray-700 hover:text-blue-700 cursor-pointer transition-colors text-lg font-medium"
                >
                  <User size={20} className="mr-2" />
                  <span className="text-sm">{user ? user.email : 'Login / Register'}</span>
                </button>
                {user && (
                  <div className="mt-2 w-full bg-gray-50 rounded-md py-1">
                    <a
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </a>
                    <a
                      href="/dashboard/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </a>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Navigation Links for Mobile */}
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-700 text-lg font-medium py-2"
              onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
            >
              Home
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-700 text-lg font-medium py-2"
              onClick={() => { navigate('/products/all'); setIsMobileMenuOpen(false); }}
            >
              Products
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-700 text-lg font-medium py-2"
              onClick={() => { navigate('/about-us'); setIsMobileMenuOpen(false); }}
            >
              About Us
            </a>
            <a
              href="#"
              className="block text-gray-700 hover:text-blue-700 text-lg font-medium py-2"
              onClick={() => { navigate('/contact-us'); setIsMobileMenuOpen(false); }}
            >
              Contact
            </a>

            {/* Category Toggle for Mobile */}
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center justify-between w-full text-gray-700 hover:text-blue-700 text-lg font-medium py-2 border-t pt-4 mt-4"
            >
              Categories
              {isCategoryMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            {isCategoryMenuOpen && (
              <ul className="flex flex-col space-y-2 pl-4">
                {categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full text-left text-gray-600 hover:text-blue-600 text-base py-1"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Other Mobile Icons (Phone, Location) - Removed as per theme reference */}
            {/* <div className="flex flex-col space-y-2 border-t pt-4 mt-4">
              <div className="flex items-center text-gray-700 text-lg font-medium">
                <Phone size={20} className="mr-2" />
                <span>1800-123-4567</span>
              </div>
              <div className="flex items-center text-gray-700 text-lg font-medium">
                <MapPin size={20} className="mr-2" />
                <span>Find Store</span>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
