/*
  # Digital Certificates Module Schema
  
  1. New Tables
    - `certificates`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `recipient_name` (text) - اسم المستلم
      - `course_name` (text) - اسم الدورة
      - `hours` (text) - عدد الساعات
      - `issue_date` (date) - تاريخ الإصدار
      - `template_id` (text) - معرف القالب
      - `serial_number` (text, unique) - الرقم التسلسلي
      - `verification_code` (text, unique) - كود التحقق
      - `pdf_url` (text) - رابط ملف PDF
      - `logo_url` (text) - رابط الشعار
      - `signature_url` (text) - رابط التوقيع
      - `created_at` (timestamptz)
      
    - `certificate_templates`
      - `id` (uuid, primary key)
      - `name` (text) - اسم القالب
      - `html_template` (text) - قالب HTML
      - `is_premium` (boolean) - قالب مدفوع
      - `thumbnail_url` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own certificates
    - Public read policy for verification
*/

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  course_name text NOT NULL,
  hours text,
  issue_date date NOT NULL,
  template_id text DEFAULT 'default',
  serial_number text UNIQUE NOT NULL,
  verification_code text UNIQUE NOT NULL,
  pdf_url text,
  logo_url text,
  signature_url text,
  created_at timestamptz DEFAULT now()
);

-- Create certificate_templates table
CREATE TABLE IF NOT EXISTS certificate_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  html_template text NOT NULL,
  is_premium boolean DEFAULT false,
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;

-- certificates policies
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Public verification policy
CREATE POLICY "Anyone can verify certificates"
  ON certificates FOR SELECT
  TO anon, authenticated
  USING (true);

-- certificate_templates policies (public read)
CREATE POLICY "Anyone can view certificate templates"
  ON certificate_templates FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS certificates_verification_code_idx ON certificates(verification_code);
CREATE INDEX IF NOT EXISTS certificates_serial_number_idx ON certificates(serial_number);
CREATE INDEX IF NOT EXISTS certificates_user_id_idx ON certificates(user_id);

-- Update profiles table to add subscription fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_tier text DEFAULT 'free';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_expires_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_expires_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'saved_designs_limit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN saved_designs_limit integer DEFAULT 1;
  END IF;
END $$;