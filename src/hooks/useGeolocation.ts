import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DeliveryInfo {
  zone_name: string;
  delivery_fee: number;
  free_delivery_threshold: number;
  estimated_delivery_hours: number;
  is_express_available: boolean;
  express_fee: number;
  express_hours: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        
        // For demo purposes, we'll use a mock API to get pincode from coordinates
        // In a real app, you'd use a proper geocoding service
        await fetchDeliveryInfo('400001'); // Mock pincode for Mumbai
        setLoading(false);
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const fetchDeliveryInfo = async (pincode: string) => {
    try {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .contains('pincode_ranges', [pincode.substring(0, 3)])
        .eq('is_active', true)
        .single();

      if (error) {
        // If no specific zone found, use default
        const { data: defaultData } = await supabase
          .from('delivery_zones')
          .select('*')
          .eq('zone_name', 'Mumbai Central')
          .single();
        
        setDeliveryInfo(defaultData);
      } else {
        setDeliveryInfo(data);
      }
    } catch (error) {
      console.error('Error fetching delivery info:', error);
    }
  };

  const checkDeliveryByPincode = async (pincode: string) => {
    setLoading(true);
    await fetchDeliveryInfo(pincode);
    setLoading(false);
  };

  useEffect(() => {
    // Auto-detect location on component mount
    getCurrentLocation();
  }, []);

  return {
    location,
    deliveryInfo,
    loading,
    error,
    getCurrentLocation,
    checkDeliveryByPincode,
  };
};