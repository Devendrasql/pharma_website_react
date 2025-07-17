import React, { useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export const LiveCartUpdates: React.FC = () => {
  const { user } = useAuth();
  const { fetchCartItems } = useCart();

  useEffect(() => {
    if (!user) return;

    // Subscribe to cart_items changes for the current user
    const subscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Cart updated:', payload);
          // Refresh cart items when changes occur
          fetchCartItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, fetchCartItems]);

  return null; // This component doesn't render anything
};