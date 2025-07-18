export interface Medicine {
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
  how_to_use?: string;
  side_effects?: string;
  precautions?: string;
  storage_instructions?: string;
  pack_size?: string;
  mrp?: number;
  discount_percentage?: number;
  average_rating?: number;
  total_reviews?: number;
  images?: ProductImage[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  image_url?: string;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  medicine_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
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
    in_stock: boolean;
  };
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_info: CustomerInfo;
  prescription_file_url?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  medicine_id: string;
  quantity: number;
  price: number;
  medicine: {
    name: string;
    image_url: string;
    dosage: string;
  };
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

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin' | 'pharmacist';
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  avatar_url?: string;
}

export interface Review {
  id: string;
  user_id: string;
  medicine_id: string;
  rating: number;
  title?: string;
  comment?: string;
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
  user_email?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  discount_percentage?: number;
  discount_amount?: number;
  promo_code: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit?: number;
  used_count: number;
}

export interface SearchFilters {
  category?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  prescriptionRequired?: boolean;
  manufacturer?: string;
  rating?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}