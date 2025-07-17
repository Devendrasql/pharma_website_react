// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { useAuth } from './useAuth';

// export interface CartItem {
//   id: string;
//   medicine_id: string;
//   quantity: number;
//   medicine: {
//     id: string;
//     name: string;
//     price: number;
//     image_url: string;
//     dosage: string;
//     prescription_required: boolean;
//   };
// }

// export const useCart = () => {
//   const { user } = useAuth();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCartItems = async () => {
//     if (!user) {
//       setCartItems([]);
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('cart_items')
//         .select(`
//           id,
//           medicine_id,
//           quantity,
//           medicine:medicines (
//             id,
//             name,
//             price,
//             image_url,
//             dosage,
//             prescription_required
//           )
//         `)
//         .eq('user_id', user.id);

//       if (error) throw error;
//       setCartItems(data || []);
//     } catch (error) {
//       console.error('Error fetching cart items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = async (medicineId: string, quantity: number = 1) => {
//     if (!user) return { error: 'User not authenticated' };

//     try {
//       const { data, error } = await supabase
//         .from('cart_items')
//         .upsert({
//           user_id: user.id,
//           medicine_id: medicineId,
//           quantity,
//         }, {
//           onConflict: 'user_id,medicine_id'
//         });

//       if (error) throw error;
//       await fetchCartItems();
//       return { data, error: null };
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//       return { data: null, error };
//     }
//   };

//   const updateQuantity = async (cartItemId: string, quantity: number) => {
//     if (!user) return { error: 'User not authenticated' };

//     if (quantity <= 0) {
//       return removeFromCart(cartItemId);
//     }

//     try {
//       const { data, error } = await supabase
//         .from('cart_items')
//         .update({ quantity })
//         .eq('id', cartItemId)
//         .eq('user_id', user.id);

//       if (error) throw error;
//       await fetchCartItems();
//       return { data, error: null };
//     } catch (error) {
//       console.error('Error updating quantity:', error);
//       return { data: null, error };
//     }
//   };

//   const removeFromCart = async (cartItemId: string) => {
//     if (!user) return { error: 'User not authenticated' };

//     try {
//       const { data, error } = await supabase
//         .from('cart_items')
//         .delete()
//         .eq('id', cartItemId)
//         .eq('user_id', user.id);

//       if (error) throw error;
//       await fetchCartItems();
//       return { data, error: null };
//     } catch (error) {
//       console.error('Error removing from cart:', error);
//       return { data: null, error };
//     }
//   };

//   const clearCart = async () => {
//     if (!user) return { error: 'User not authenticated' };

//     try {
//       const { data, error } = await supabase
//         .from('cart_items')
//         .delete()
//         .eq('user_id', user.id);

//       if (error) throw error;
//       setCartItems([]);
//       return { data, error: null };
//     } catch (error) {
//       console.error('Error clearing cart:', error);
//       return { data: null, error };
//     }
//   };

//   useEffect(() => {
//     fetchCartItems();
//   }, [user]);

//   const total = cartItems.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
//   const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   return {
//     cartItems,
//     loading,
//     total,
//     itemCount,
//     addToCart,
//     updateQuantity,
//     removeFromCart,
//     clearCart,
//     fetchCartItems,
//   };
// };

// src/hooks/useCart.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient'; // Import your Supabase client
import { useAuth } from './useAuth.tsx'; // Import useAuth to get user ID

// Define the structure of a product from your 'medicines' table
// IMPORTANT: Adjust these fields to match your actual 'medicines' table columns
interface Product {
  id: string; // This should be the primary key of your medicines table
  name: string;
  price: number;
  image_url?: string; // Assuming you have an image URL column
  // Add other relevant product details like description, category, etc.
}

// Define the structure of a cart item (local state representation)
interface CartItem {
  id: string; // This is the product_id (from medicines table)
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string; // Image URL from the product
  supabase_id?: string; // The 'id' (primary key) of the row in the 'cart_items' table
}

// Define the shape of the CartContext
interface CartContextType {
  cartItems: CartItem[];
  // addToCart now accepts product_id and quantity
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>; // Use productId for removal
  updateQuantity: (productId: string, quantity: number) => Promise<void>; // Use productId for update
  clearCart: () => Promise<void>;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, loading: authLoading } = useAuth(); // Get user from auth context

  // Function to fetch cart items from Supabase
  const fetchCartItems = useCallback(async () => {
    if (!user || authLoading) {
      setCartItems([]); // Clear cart if no user or still loading auth
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('supabase_id:id, product_id, name, price, quantity, imageUrl') // Alias 'id' to 'supabase_id'
        .eq('user_id', user.id); // Fetch only current user's cart items

      if (error) throw error;

      // Map Supabase data to CartItem interface, ensuring 'id' is product_id
      const fetchedItems: CartItem[] = data.map(item => ({
        id: item.product_id, // This is the product's ID
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        supabase_id: item.supabase_id, // This is the cart_item's row ID
      }));
      setCartItems(fetchedItems);
    } catch (error: any) {
      console.error("Error fetching cart items:", error.message);
      // alert("Failed to load cart. Please try again."); // Use a proper UI notification
    }
  }, [user, authLoading]);

  // Effect to fetch cart items when user changes or on initial load
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // addToCart now takes productId and quantity
  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    // 1. Fetch product details from 'medicines' table
    let product: Product | null = null;
    try {
      const { data, error } = await supabase
        .from('medicines') // Assuming your products table is named 'medicines'
        .select('id, name, price, image_url') // Select relevant fields
        .eq('id', productId)
        .single(); // Expecting a single product

      if (error) throw error;
      if (!data) {
        throw new Error("Product not found in medicines table.");
      }
      product = data;
    } catch (error: any) {
      console.error("Error fetching product details:", error.message);
      alert("Failed to add item: Product details could not be loaded.");
      return; // Stop if product not found
    }

    // 2. Optimistically update local cart state
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === productId);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        return [...prevItems, {
          id: product!.id,
          name: product!.name,
          price: product!.price,
          quantity: quantity,
          imageUrl: product!.image_url,
          // supabase_id will be set after successful insert/update in DB
        }];
      }
    });

    // 3. Update/Insert into 'cart_items' table in Supabase
    try {
      const existingSupabaseCartItem = cartItems.find((i) => i.id === productId && i.supabase_id);

      if (existingSupabaseCartItem) {
        // Update existing item in Supabase
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingSupabaseCartItem.quantity + quantity })
          .eq('id', existingSupabaseCartItem.supabase_id);
        if (error) throw error;
      } else {
        // Insert new item into Supabase
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product!.id, // Use product's ID
            name: product!.name,
            price: product!.price,
            quantity: quantity,
            imageUrl: product!.image_url,
          })
          .select('id'); // Select the newly inserted ID
        if (error) throw error;

        // Update the local state with the new supabase_id if it was a new insert
        setCartItems(prevItems => prevItems.map(i =>
          i.id === productId && !i.supabase_id ? { ...i, supabase_id: data[0].id } : i
        ));
      }
      alert("Item added to cart successfully!");
    } catch (error: any) {
      console.error("Error adding/updating cart in Supabase:", error.message);
      alert("Failed to add item to cart. Please try again.");
      fetchCartItems(); // Re-fetch to sync state in case of error
    }
  };

  // removeFromCart now uses productId to identify the item in local state
  const removeFromCart = async (productId: string) => {
    if (!user) return;

    const itemToRemove = cartItems.find(item => item.id === productId); // Find by product ID
    if (!itemToRemove || !itemToRemove.supabase_id) {
      console.warn("Item not found in cart or missing Supabase ID:", productId);
      return;
    }

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId)); // Filter by product ID

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemToRemove.supabase_id); // Delete by Supabase row ID
      if (error) throw error;
      alert("Item removed from cart.");
    } catch (error: any) {
      console.error("Error removing from cart in Supabase:", error.message);
      alert("Failed to remove item from cart. Please try again.");
      fetchCartItems(); // Re-fetch to sync state
    }
  };

  // updateQuantity now uses productId to identify the item in local state
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    const newQuantity = Math.max(1, quantity);
    const itemToUpdate = cartItems.find(item => item.id === productId); // Find by product ID

    if (!itemToUpdate || !itemToUpdate.supabase_id) {
      console.warn("Item not found in cart or missing Supabase ID:", productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item // Update by product ID
      )
    );

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemToUpdate.supabase_id); // Update by Supabase row ID
      if (error) throw error;
      alert("Cart quantity updated.");
    } catch (error: any) {
      console.error("Error updating quantity in Supabase:", error.message);
      alert("Failed to update quantity. Please try again.");
      fetchCartItems(); // Re-fetch to sync state
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setCartItems([]); // Optimistic update

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id); // Delete all items for the current user
      if (error) throw error;
      alert("Cart cleared.");
    } catch (error: any) {
      console.error("Error clearing cart in Supabase:", error.message);
      alert("Failed to clear cart. Please try again.");
      fetchCartItems(); // Re-fetch to sync state
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
