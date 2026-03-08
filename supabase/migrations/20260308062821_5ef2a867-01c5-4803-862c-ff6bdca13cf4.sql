
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id TEXT NOT NULL,
  scheme_name TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  mobile_number TEXT NOT NULL DEFAULT '',
  annual_income TEXT NOT NULL DEFAULT '',
  land_size TEXT NOT NULL DEFAULT '',
  aadhaar_status TEXT NOT NULL DEFAULT '',
  family_size TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  additional_info JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own applications"
  ON public.applications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.applications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.applications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Allow anonymous inserts for non-logged-in users
CREATE POLICY "Anonymous users can insert applications"
  ON public.applications FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);
