-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  farm_size DECIMAL,
  crop_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create soil data table
CREATE TABLE public.soil_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ph DECIMAL,
  moisture DECIMAL,
  nitrogen DECIMAL,
  phosphorus DECIMAL,
  potassium DECIMAL,
  organic_matter DECIMAL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on soil_data
ALTER TABLE public.soil_data ENABLE ROW LEVEL SECURITY;

-- Soil data policies
CREATE POLICY "Users can view their own soil data"
  ON public.soil_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own soil data"
  ON public.soil_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soil data"
  ON public.soil_data FOR UPDATE
  USING (auth.uid() = user_id);

-- Create crop suggestions table
CREATE TABLE public.crop_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  suitability_score INTEGER NOT NULL,
  price_range_min DECIMAL NOT NULL,
  price_range_max DECIMAL NOT NULL,
  trend TEXT NOT NULL CHECK (trend IN ('increasing', 'decreasing', 'stable')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on crop_suggestions
ALTER TABLE public.crop_suggestions ENABLE ROW LEVEL SECURITY;

-- Crop suggestions policies
CREATE POLICY "Users can view their own crop suggestions"
  ON public.crop_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own crop suggestions"
  ON public.crop_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crop suggestions"
  ON public.crop_suggestions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own crop suggestions"
  ON public.crop_suggestions FOR DELETE
  USING (auth.uid() = user_id);

-- Create temperature readings table
CREATE TABLE public.temperature_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature DECIMAL NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on temperature_readings
ALTER TABLE public.temperature_readings ENABLE ROW LEVEL SECURITY;

-- Temperature readings policies
CREATE POLICY "Users can view their own temperature readings"
  ON public.temperature_readings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own temperature readings"
  ON public.temperature_readings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create growth metrics table
CREATE TABLE public.growth_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  height DECIMAL NOT NULL,
  health_score INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on growth_metrics
ALTER TABLE public.growth_metrics ENABLE ROW LEVEL SECURITY;

-- Growth metrics policies
CREATE POLICY "Users can view their own growth metrics"
  ON public.growth_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own growth metrics"
  ON public.growth_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create yield predictions table
CREATE TABLE public.yield_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  predicted_yield DECIMAL NOT NULL,
  actual_yield DECIMAL DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on yield_predictions
ALTER TABLE public.yield_predictions ENABLE ROW LEVEL SECURITY;

-- Yield predictions policies
CREATE POLICY "Users can view their own yield predictions"
  ON public.yield_predictions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own yield predictions"
  ON public.yield_predictions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own yield predictions"
  ON public.yield_predictions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crop_suggestions_updated_at
  BEFORE UPDATE ON public.crop_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_yield_predictions_updated_at
  BEFORE UPDATE ON public.yield_predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger function for auto-creating user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();