
-- Disable RLS on alerts table
ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;

-- Disable RLS on incidents table
ALTER TABLE public.incidents DISABLE ROW LEVEL SECURITY;

-- Disable RLS on logs table
ALTER TABLE public.logs DISABLE ROW LEVEL SECURITY;
