// src/pages/UserProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase client
import { PlusCircle, Edit, Trash2 } from 'lucide-react'; // Icons for actions

// Define interface for UserAddress based on your schema
interface UserAddress {
  id: string;
  user_id: string;
  address_type: 'home' | 'work' | 'other';
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

const UserProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Display only, email from auth.user
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<UserAddress | null>(null); // For editing

  // Form states for adding/editing address
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');
  const [formFullName, setFormFullName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddressLine1, setFormAddressLine1] = useState('');
  const [formAddressLine2, setFormAddressLine2] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formState, setFormState] = useState('');
  const [formPincode, setFormPincode] = useState('');
  const [formLandmark, setFormLandmark] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Fetch user profile data and addresses
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setError(null);
      try {
        // Set basic user info from auth
        setEmail(user.email || '');
        // You might have a 'profiles' table for more user details
        // const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        // if (profileError) console.error("Error fetching profile:", profileError.message);
        // if (profileData) setName(profileData.full_name || user.email);

        // For now, use email as name if no profile table
        setName(user.email || '');

        // Fetch user addresses
        const { data: addressesData, error: addressesError } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false }) // Default address first
          .order('created_at', { ascending: false }); // Latest address if no default

        if (addressesError) throw addressesError;
        setAddresses(addressesData as UserAddress[]);

      } catch (err: any) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to load user profile or addresses.");
      } finally {
        setLoadingData(false);
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    } else if (!authLoading && !user) {
      navigate('/'); // Redirect if not authenticated
    }
  }, [user, authLoading, navigate]);

  const resetAddressForm = () => {
    setCurrentAddress(null);
    setAddressType('home');
    setFormFullName('');
    setFormPhone('');
    setFormAddressLine1('');
    setFormAddressLine2('');
    setFormCity('');
    setFormState('');
    setFormPincode('');
    setFormLandmark('');
    setFormIsDefault(false);
    setShowAddressForm(false);
  };

  const handleEditAddress = (address: UserAddress) => {
    setCurrentAddress(address);
    setAddressType(address.address_type);
    setFormFullName(address.full_name);
    setFormPhone(address.phone);
    setFormAddressLine1(address.address_line1);
    setFormAddressLine2(address.address_line2 || '');
    setFormCity(address.city);
    setFormState(address.state);
    setFormPincode(address.pincode);
    setFormLandmark(address.landmark || '');
    setFormIsDefault(address.is_default);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!user || !window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id); // Ensure user can only delete their own address

      if (error) throw error;
      alert("Address deleted successfully!");
      setAddresses(prev => prev.filter(addr => addr.id !== addressId)); // Optimistic update
    } catch (err: any) {
      console.error("Error deleting address:", err.message);
      alert("Failed to delete address. Please try again.");
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoadingData(true); // Indicate form submission is loading
    const newAddressData = {
      user_id: user.id,
      address_type: addressType,
      full_name: formFullName,
      phone: formPhone,
      address_line1: formAddressLine1,
      address_line2: formAddressLine2 || null,
      city: formCity,
      state: formState,
      pincode: formPincode,
      landmark: formLandmark || null,
      is_default: formIsDefault,
    };

    try {
      if (currentAddress) {
        // Update existing address
        const { data, error } = await supabase
          .from('user_addresses')
          .update(newAddressData)
          .eq('id', currentAddress.id)
          .eq('user_id', user.id)
          .select(); // Select updated row to get full data

        if (error) throw error;
        alert("Address updated successfully!");
        setAddresses(prev => prev.map(addr => addr.id === currentAddress.id ? data[0] : addr));
      } else {
        // Insert new address
        const { data, error } = await supabase
          .from('user_addresses')
          .insert(newAddressData)
          .select(); // Select inserted row to get full data

        if (error) throw error;
        alert("Address added successfully!");
        setAddresses(prev => [...prev, data[0]]);
      }
      resetAddressForm(); // Close form and clear fields
    } catch (err: any) {
      console.error("Error saving address:", err.message);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoadingData(false);
    }
  };

  if (authLoading || loadingData) {
    return <div className="text-center py-10 text-gray-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Please log in to view your profile.</div>;
  }

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">My Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <p className="text-lg text-gray-700 mb-4">
          Email: <span className="font-semibold">{email}</span>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Name: <span className="font-semibold">{name}</span>
        </p>

        {/* User Addresses Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-t pt-6 mt-6">My Addresses</h2>
        {addresses.length === 0 && !showAddressForm ? (
          <p className="text-gray-600 mb-4">You have no saved addresses.</p>
        ) : (
          <div className="space-y-4 mb-6">
            {addresses.map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-md p-4 relative">
                {address.is_default && (
                  <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">Default</span>
                )}
                <p className="font-semibold text-gray-800">{address.full_name} ({address.address_type.toUpperCase()})</p>
                <p className="text-gray-700 text-sm">{address.address_line1}</p>
                {address.address_line2 && <p className="text-gray-700 text-sm">{address.address_line2}</p>}
                <p className="text-gray-700 text-sm">{address.city}, {address.state} - {address.pincode}</p>
                {address.landmark && <p className="text-gray-700 text-sm">Landmark: {address.landmark}</p>}
                <p className="text-gray-700 text-sm">Phone: {address.phone}</p>
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (showAddressForm && currentAddress) { // If editing, close form
              resetAddressForm();
            } else if (showAddressForm) { // If adding, close form
              resetAddressForm();
            } else { // If form is hidden, open for new address
              setShowAddressForm(true);
              setCurrentAddress(null); // Ensure it's for new address
            }
          }}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
        >
          {showAddressForm && currentAddress ? 'Cancel Edit' : showAddressForm ? 'Cancel Add' : <><PlusCircle size={20} className="mr-2" /> Add New Address</>}
        </button>

        {showAddressForm && (
          <form onSubmit={handleAddressSubmit} className="space-y-4 mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{currentAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <div>
              <label htmlFor="addressType" className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
              <select
                id="addressType"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={addressType}
                onChange={(e) => setAddressType(e.target.value as 'home' | 'work' | 'other')}
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="formFullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="formFullName" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formFullName} onChange={(e) => setFormFullName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" id="formPhone" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formAddressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
              <input type="text" id="formAddressLine1" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formAddressLine1} onChange={(e) => setFormAddressLine1(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formAddressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
              <input type="text" id="formAddressLine2" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formAddressLine2} onChange={(e) => setFormAddressLine2(e.target.value)} />
            </div>
            <div>
              <label htmlFor="formCity" className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" id="formCity" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formCity} onChange={(e) => setFormCity(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formState" className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" id="formState" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formState} onChange={(e) => setFormState(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formPincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input type="text" id="formPincode" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formPincode} onChange={(e) => setFormPincode(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="formLandmark" className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
              <input type="text" id="formLandmark" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={formLandmark} onChange={(e) => setFormLandmark(e.target.value)} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="formIsDefault" className="h-4 w-4 text-blue-600 border-gray-300 rounded" checked={formIsDefault} onChange={(e) => setFormIsDefault(e.target.checked)} />
              <label htmlFor="formIsDefault" className="ml-2 block text-sm text-gray-900">Set as Default Address</label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold"
              disabled={loadingData}
            >
              {loadingData ? 'Saving...' : currentAddress ? 'Update Address' : 'Add Address'}
            </button>
            <button
              type="button"
              onClick={resetAddressForm}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
