/*
  # Canvas Schema Update

  1. New Tables
    - `canvas_products`: Stores products associated with canvases
      - `id` (uuid, primary key)
      - `canvas_id` (uuid, foreign key)
      - `name` (text)
      - `type` (product_type enum)
      - `balance` (numeric)
      - `yield_rate` (numeric)
      - `has_cards` (boolean)
    - `canvas_metrics`: Stores metrics for canvases
      - `id` (uuid, primary key)
      - `canvas_id` (uuid, foreign key)
      - `name` (text)
      - `value` (numeric)
      - `graph_type` (text)
      - `is_primary` (boolean)
    - `payment_methods`: Stores available payment methods
      - `id` (uuid, primary key)
      - `canvas_id` (uuid, foreign key)
      - `type` (payment_method_type enum)
      - `is_enabled` (boolean)

  2. Changes
    - Add `name` and `type` columns to `canvases` table
    - Add new enum types for canvas types, product types, and payment methods

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enums first
DO $$ BEGIN
    CREATE TYPE canvas_type AS ENUM ('property', 'investment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE product_type AS ENUM ('checking', 'savings', 'cd', 'credit', 'debit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('ach', 'wire', 'check', 'card');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add new columns to canvases table
DO $$ BEGIN
    ALTER TABLE canvases 
    ADD COLUMN name text,
    ADD COLUMN type canvas_type;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Update existing canvases with default values
UPDATE canvases 
SET name = COALESCE(name, 'Untitled Canvas'),
    type = COALESCE(type, 'property'::canvas_type);

-- Make columns required after setting defaults
ALTER TABLE canvases 
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN type SET NOT NULL;

-- Create canvas products table
CREATE TABLE IF NOT EXISTS canvas_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id uuid REFERENCES canvases(id) ON DELETE CASCADE,
  name text NOT NULL,
  type product_type NOT NULL,
  balance numeric(12,2) DEFAULT 0,
  yield_rate numeric(5,2),
  has_cards boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create canvas metrics table
CREATE TABLE IF NOT EXISTS canvas_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id uuid REFERENCES canvases(id) ON DELETE CASCADE,
  name text NOT NULL,
  value numeric(12,2),
  graph_type text DEFAULT 'line',
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id uuid REFERENCES canvases(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  is_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE canvas_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for canvas products
CREATE POLICY "Users can view their own canvas products"
  ON canvas_products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own canvas products"
  ON canvas_products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canvas products"
  ON canvas_products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for canvas metrics
CREATE POLICY "Users can view their own canvas metrics"
  ON canvas_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own canvas metrics"
  ON canvas_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canvas metrics"
  ON canvas_metrics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for payment methods
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_canvas_products_canvas_id ON canvas_products(canvas_id);
CREATE INDEX IF NOT EXISTS idx_canvas_metrics_canvas_id ON canvas_metrics(canvas_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_canvas_id ON payment_methods(canvas_id);

-- Insert default data for existing canvases
INSERT INTO canvas_products (canvas_id, name, type, balance, yield_rate, has_cards, user_id)
SELECT 
  c.id,
  CASE 
    WHEN c.type = 'property' THEN 'Operating Account'
    ELSE 'Checking Account'
  END,
  'checking'::product_type,
  CASE 
    WHEN c.type = 'property' THEN 245000
    ELSE 25000
  END,
  CASE 
    WHEN c.type = 'property' THEN 0.1
    ELSE 0.25
  END,
  CASE 
    WHEN c.type = 'property' THEN true
    ELSE false
  END,
  c.user_id
FROM canvases c
WHERE NOT EXISTS (
  SELECT 1 FROM canvas_products p WHERE p.canvas_id = c.id
);

-- Insert default metrics
INSERT INTO canvas_metrics (canvas_id, name, value, is_primary, user_id)
SELECT 
  c.id,
  CASE 
    WHEN c.type = 'property' THEN 'Net Operating Income'
    ELSE 'Balance'
  END,
  CASE 
    WHEN c.type = 'property' THEN 32.5
    ELSE 125000
  END,
  true,
  c.user_id
FROM canvases c
WHERE NOT EXISTS (
  SELECT 1 FROM canvas_metrics m WHERE m.canvas_id = c.id
);

-- Insert default payment methods
INSERT INTO payment_methods (canvas_id, type, user_id)
SELECT 
  c.id,
  'ach'::payment_method_type,
  c.user_id
FROM canvases c
WHERE NOT EXISTS (
  SELECT 1 FROM payment_methods m WHERE m.canvas_id = c.id
);