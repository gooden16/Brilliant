/*
  # Initial Schema Setup for Financial Advisor Platform

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `client_name` (text)
      - `client_email` (text)
      - `date` (date)
      - `time` (time)
      - `status` (enum)
      - `created_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)
    
    - `canvases`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, foreign key to appointments)
      - `key_metrics` (text[])
      - `features` (text[])
      - `users` (text[])
      - `transcription` (text)
      - `status` (enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE canvas_status AS ENUM ('draft', 'approved');

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_email text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  CONSTRAINT valid_email CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create canvases table
CREATE TABLE IF NOT EXISTS canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id),
  key_metrics text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  users text[] DEFAULT '{}',
  transcription text,
  status canvas_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvases ENABLE ROW LEVEL SECURITY;

-- Create policies for appointments
CREATE POLICY "Users can view their own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for canvases
CREATE POLICY "Users can view their own canvases"
  ON canvases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own canvases"
  ON canvases
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own canvases"
  ON canvases
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_canvases_appointment_id ON canvases(appointment_id);
CREATE INDEX IF NOT EXISTS idx_canvases_user_id ON canvases(user_id);