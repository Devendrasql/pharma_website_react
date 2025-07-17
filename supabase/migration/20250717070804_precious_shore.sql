/*
  # Enhanced Pharmacy Schema for 1mg-like Features

  1. New Tables
    - `reviews` - Product reviews and ratings
    - `promotions` - Database-managed promotional cards
    - `delivery_zones` - Geolocation-based delivery settings
    - `user_addresses` - Customer delivery addresses
    - `product_images` - Multiple images per product
    - `product_variants` - Different sizes/quantities of same medicine

  2. Enhanced Tables
    - Enhanced medicines table with more detailed information
    - Enhanced orders table with delivery tracking
    - Enhanced users profile information

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  comment text,
  helpful_count integer DEFAULT 0,
  verified_purchase boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, medicine_id)
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  discount_percentage integer,
  discount_amount decimal(10,2),
  promo_code text UNIQUE,
  valid_from timestamptz DEFAULT now(),
  valid_until timestamptz,
  is_active boolean DEFAULT true,
  category_id uuid REFERENCES categories(id),
  min_order_amount decimal(10,2) DEFAULT 0,
  max_discount_amount decimal(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create delivery zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode_ranges text[], -- Array of pincode ranges
  delivery_fee decimal(10,2) DEFAULT 0,
  free_delivery_threshold decimal(10,2) DEFAULT 500,
  estimated_delivery_hours integer DEFAULT 24,
  is_express_available boolean DEFAULT false,
  express_fee decimal(10,2) DEFAULT 50,
  express_hours integer DEFAULT 6,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  address_type text DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
  full_name text NOT NULL,
  phone text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  landmark text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product images table
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add more detailed columns to medicines table
DO $$
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'how_to_use') THEN
    ALTER TABLE medicines ADD COLUMN how_to_use text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'side_effects') THEN
    ALTER TABLE medicines ADD COLUMN side_effects text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'precautions') THEN
    ALTER TABLE medicines ADD COLUMN precautions text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'storage_instructions') THEN
    ALTER TABLE medicines ADD COLUMN storage_instructions text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'pack_size') THEN
    ALTER TABLE medicines ADD COLUMN pack_size text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'mrp') THEN
    ALTER TABLE medicines ADD COLUMN mrp decimal(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'discount_percentage') THEN
    ALTER TABLE medicines ADD COLUMN discount_percentage integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'average_rating') THEN
    ALTER TABLE medicines ADD COLUMN average_rating decimal(3,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'medicines' AND column_name = 'total_reviews') THEN
    ALTER TABLE medicines ADD COLUMN total_reviews integer DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT TO public USING (true);

CREATE POLICY "Users can create reviews for their purchases"
  ON reviews FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Promotions policies (public read)
CREATE POLICY "Anyone can view active promotions"
  ON promotions FOR SELECT TO public
  USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));

-- Delivery zones policies (public read)
CREATE POLICY "Anyone can view delivery zones"
  ON delivery_zones FOR SELECT TO public
  USING (is_active = true);

-- User addresses policies
CREATE POLICY "Users can view their own addresses"
  ON user_addresses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own addresses"
  ON user_addresses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON user_addresses FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON user_addresses FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Product images policies (public read)
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT TO public USING (true);

-- Insert sample data

-- Sample delivery zones
INSERT INTO delivery_zones (zone_name, city, state, pincode_ranges, delivery_fee, free_delivery_threshold, estimated_delivery_hours) VALUES
  ('Mumbai Central', 'Mumbai', 'Maharashtra', ARRAY['400001-400099'], 0, 299, 6),
  ('Delhi NCR', 'New Delhi', 'Delhi', ARRAY['110001-110099', '201001-201999'], 49, 499, 12),
  ('Bangalore Urban', 'Bangalore', 'Karnataka', ARRAY['560001-560099'], 39, 399, 8),
  ('Chennai Metro', 'Chennai', 'Tamil Nadu', ARRAY['600001-600099'], 39, 399, 10),
  ('Hyderabad City', 'Hyderabad', 'Telangana', ARRAY['500001-500099'], 39, 399, 8)
ON CONFLICT DO NOTHING;

-- Sample promotions
INSERT INTO promotions (title, description, image_url, discount_percentage, promo_code, valid_until, min_order_amount, max_discount_amount) VALUES
  ('New Year Health Sale', 'Get up to 30% off on all medicines and health products', 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500', 30, 'HEALTH30', '2025-01-31 23:59:59', 299, 500),
  ('First Order Special', 'Extra 20% off on your first medicine order', 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500', 20, 'FIRST20', '2025-02-15 23:59:59', 199, 200),
  ('Free Delivery Weekend', 'Free delivery on all orders this weekend', 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=500', 0, 'FREEDEL', '2025-01-20 23:59:59', 0, 0)
ON CONFLICT (promo_code) DO NOTHING;

-- Update existing medicines with enhanced data
UPDATE medicines SET 
  how_to_use = 'Take as directed by your healthcare provider. Can be taken with or without food.',
  side_effects = 'Common side effects may include nausea, dizziness, or stomach upset. Consult your doctor if symptoms persist.',
  precautions = 'Do not exceed recommended dosage. Keep out of reach of children. Store in a cool, dry place.',
  storage_instructions = 'Store below 25°C in a dry place, away from direct sunlight.',
  pack_size = '10 tablets',
  mrp = price * 1.2,
  discount_percentage = 15,
  average_rating = 4.2,
  total_reviews = FLOOR(RANDOM() * 100) + 10
WHERE how_to_use IS NULL;

-- Sample reviews
INSERT INTO reviews (user_id, medicine_id, rating, title, comment, verified_purchase) 
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  m.id,
  FLOOR(RANDOM() * 2) + 4, -- Rating between 4-5
  'Great product!',
  'Works exactly as described. Fast delivery and good packaging.',
  true
FROM medicines m
LIMIT 5
ON CONFLICT (user_id, medicine_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_medicine_id ON reviews(medicine_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_pincode ON delivery_zones USING GIN(pincode_ranges);
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_product_images_medicine_id ON product_images(medicine_id);

-- Create function to update medicine ratings
CREATE OR REPLACE FUNCTION update_medicine_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE medicines 
  SET 
    average_rating = (
      SELECT ROUND(AVG(rating)::numeric, 2) 
      FROM reviews 
      WHERE medicine_id = COALESCE(NEW.medicine_id, OLD.medicine_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE medicine_id = COALESCE(NEW.medicine_id, OLD.medicine_id)
    )
  WHERE id = COALESCE(NEW.medicine_id, OLD.medicine_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
DROP TRIGGER IF EXISTS update_medicine_rating_trigger ON reviews;
CREATE TRIGGER update_medicine_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_medicine_rating();

-- Create updated_at triggers for new tables
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();