import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface CartItem {
  id: string;
  medicine_id: string;
  quantity: number;
  medicine: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    dosage: string;
    prescription_required: boolean;
  };
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          medicine_id,
          quantity,
          medicine:medicines (
            id,
            name,
            price,
            image_url,
            dosage,
            prescription_required
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (medicineId: string, quantity: number = 1) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          medicine_id: medicineId,
          quantity,
        }, {
          onConflict: 'user_id,medicine_id'
        });

      if (error) throw error;
      await fetchCartItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { data: null, error };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (!user) return { error: 'User not authenticated' };

    if (quantity <= 0) {
      return removeFromCart(cartItemId);
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCartItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { data: null, error };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', user.id);

      if (error) throw error;
      await fetchCartItems();
      return { data, error: null };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { data: null, error };
    }
  };

  const clearCart = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
      return { data, error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const total = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    loading,
    total,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCartItems,
  };
};