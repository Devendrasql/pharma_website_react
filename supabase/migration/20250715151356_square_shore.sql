/*
  # Pharmacy Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
    
    - `medicines`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `in_stock` (boolean)
      - `prescription_required` (boolean)
      - `dosage` (text)
      - `manufacturer` (text)
      - `active_ingredient` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `medicine_id` (uuid, foreign key)
      - `quantity` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `total_amount` (decimal)
      - `status` (text)
      - `customer_info` (jsonb)
      - `prescription_file_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `medicine_id` (uuid, foreign key)
      - `quantity` (integer)
      - `price` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Cart items are user-specific
    - Orders are user-specific
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  in_stock boolean DEFAULT true,
  prescription_required boolean DEFAULT false,
  dosage text,
  manufacturer text,
  active_ingredient text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, medicine_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  customer_info jsonb NOT NULL,
  prescription_file_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Medicines policies (public read)
CREATE POLICY "Medicines are viewable by everyone"
  ON medicines
  FOR SELECT
  TO public
  USING (true);

-- Cart items policies (user-specific)
CREATE POLICY "Users can view own cart items"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Orders policies (user-specific)
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Order items policies (user-specific through orders)
CREATE POLICY "Users can view own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Pain Relief', 'Medications for pain management and relief'),
  ('Antibiotics', 'Prescription antibiotics for bacterial infections'),
  ('Vitamins', 'Vitamin supplements and nutritional products'),
  ('Digestive Health', 'Medications for digestive and stomach issues'),
  ('Allergy Relief', 'Antihistamines and allergy medications'),
  ('Cardiovascular', 'Heart and blood pressure medications')
ON CONFLICT (name) DO NOTHING;

-- Insert sample medicines
INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Paracetamol 500mg',
  'Pain relief and fever reducer. Effective for headaches, muscle aches, and cold symptoms.',
  8.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  '500mg tablets',
  'PharmaCorp',
  'Paracetamol'
FROM categories c WHERE c.name = 'Pain Relief'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Ibuprofen 400mg',
  'Anti-inflammatory medication for pain relief and reduction of inflammation.',
  12.49,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  '400mg tablets',
  'MediPharm',
  'Ibuprofen'
FROM categories c WHERE c.name = 'Pain Relief'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Amoxicillin 250mg',
  'Antibiotic medication for bacterial infections. Requires prescription.',
  24.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  true,
  '250mg capsules',
  'PharmaCorp',
  'Amoxicillin'
FROM categories c WHERE c.name = 'Antibiotics'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Vitamin D3 1000IU',
  'Essential vitamin supplement for bone health and immune system support.',
  15.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  '1000IU tablets',
  'VitaHealth',
  'Cholecalciferol'
FROM categories c WHERE c.name = 'Vitamins'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Omeprazole 20mg',
  'Proton pump inhibitor for acid reflux and stomach ulcer treatment.',
  18.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  true,
  '20mg capsules',
  'GastroMed',
  'Omeprazole'
FROM categories c WHERE c.name = 'Digestive Health'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Multivitamin Complex',
  'Comprehensive daily vitamin supplement with essential nutrients.',
  22.49,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  'Daily tablets',
  'VitaHealth',
  'Mixed vitamins'
FROM categories c WHERE c.name = 'Vitamins'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Cetirizine 10mg',
  'Antihistamine for allergy relief including hay fever and skin allergies.',
  9.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  '10mg tablets',
  'AllergyMed',
  'Cetirizine'
FROM categories c WHERE c.name = 'Allergy Relief'
ON CONFLICT DO NOTHING;

INSERT INTO medicines (name, description, price, category_id, image_url, in_stock, prescription_required, dosage, manufacturer, active_ingredient)
SELECT 
  'Aspirin 75mg',
  'Low-dose aspirin for cardiovascular protection and blood thinning.',
  6.99,
  c.id,
  'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500',
  true,
  false,
  '75mg tablets',
  'CardioPharm',
  'Aspirin'
FROM categories c WHERE c.name = 'Cardiovascular'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_medicines_category_id ON medicines(category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_in_stock ON medicines(in_stock);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();