import { ReactNode } from "react";

export interface Medicine {
  total_reviews: ReactNode;
  mrp: boolean;
  discount_percentage: ReactNode;
  pack_size: string | null;
  storage_instructions: string;
  how_to_use: string;
  side_effects: string;
  precautions: string;
  average_rating: ReactNode;
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  image_url: string | null;
  in_stock: boolean;
  prescription_required: boolean;
  dosage: string | null;
  manufacturer: string | null;
  active_ingredient: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

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

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  customer_info: CustomerInfo;
  prescription_file_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}