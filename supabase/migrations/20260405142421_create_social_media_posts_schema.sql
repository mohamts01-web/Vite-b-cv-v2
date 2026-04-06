/*
  # Social Media Posts Module Schema
  
  1. New Tables
    - `social_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `occasion_type` (text) - نوع المناسبة
      - `sender_name` (text) - اسم المرسل
      - `recipient_name` (text) - اسم المستلم
      - `message` (text) - الرسالة
      - `style` (text) - النمط (Luxury, Fun, Minimal, etc)
      - `colors` (jsonb) - الألوان المختارة
      - `template_data` (jsonb) - بيانات القالب
      - `image_url` (text) - رابط الصورة المولدة
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `social_templates`
      - `id` (uuid, primary key)
      - `name` (text) - اسم القالب
      - `occasion_type` (text) - نوع المناسبة
      - `style` (text) - النمط
      - `is_premium` (boolean) - قالب مدفوع
      - `thumbnail_url` (text)
      - `template_config` (jsonb) - تكوين القالب
      - `created_at` (timestamptz)
      
    - `social_designs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `post_id` (uuid, references social_posts)
      - `title` (text) - عنوان التصميم
      - `canvas_data` (jsonb) - بيانات Canvas
      - `shareable_code` (text, unique) - كود المشاركة
      - `thumbnail_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own content
*/

-- Create social_posts table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  occasion_type text NOT NULL DEFAULT 'other',
  sender_name text DEFAULT '',
  recipient_name text DEFAULT '',
  message text DEFAULT '',
  style text DEFAULT 'modern',
  colors jsonb DEFAULT '[]'::jsonb,
  template_data jsonb DEFAULT '{}'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_templates table
CREATE TABLE IF NOT EXISTS social_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  occasion_type text DEFAULT 'general',
  style text DEFAULT 'modern',
  is_premium boolean DEFAULT false,
  thumbnail_url text,
  template_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create social_designs table
CREATE TABLE IF NOT EXISTS social_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE,
  title text DEFAULT 'تصميم جديد',
  canvas_data jsonb DEFAULT '{}'::jsonb,
  shareable_code text UNIQUE,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_designs ENABLE ROW LEVEL SECURITY;

-- social_posts policies
CREATE POLICY "Users can view own social posts"
  ON social_posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own social posts"
  ON social_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social posts"
  ON social_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social posts"
  ON social_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- social_templates policies (public read, admin write)
CREATE POLICY "Anyone can view social templates"
  ON social_templates FOR SELECT
  TO authenticated
  USING (true);

-- social_designs policies
CREATE POLICY "Users can view own social designs"
  ON social_designs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own social designs"
  ON social_designs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social designs"
  ON social_designs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social designs"
  ON social_designs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS social_designs_shareable_code_idx ON social_designs(shareable_code);
CREATE INDEX IF NOT EXISTS social_posts_user_id_idx ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS social_designs_user_id_idx ON social_designs(user_id);