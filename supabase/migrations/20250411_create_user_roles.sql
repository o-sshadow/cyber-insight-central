-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_roles_user_id_key UNIQUE (user_id)
);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Grant permissions to the authenticated role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;

-- Create policies for secure access
-- Allow all authenticated users to view user roles
CREATE POLICY "Anyone can view user roles" ON public.user_roles
    FOR SELECT USING (true);

-- Only admins can update user roles
CREATE POLICY "Admins can update user roles" ON public.user_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Only admins can insert user roles
CREATE POLICY "Admins can insert user roles" ON public.user_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Only admins can delete user roles
CREATE POLICY "Admins can delete user roles" ON public.user_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND is_admin = true
        )
    );

-- Bootstrap function to ensure there's at least one admin
CREATE OR REPLACE FUNCTION public.ensure_first_user_is_admin()
RETURNS TRIGGER AS $$
DECLARE
    admin_count INT;
BEGIN
    SELECT COUNT(*) INTO admin_count FROM public.user_roles WHERE is_admin = true;
    
    IF admin_count = 0 THEN
        INSERT INTO public.user_roles (user_id, is_admin)
        VALUES (NEW.id, true);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created_make_first_admin
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_first_user_is_admin();

-- Add type definition for TypeScript
COMMENT ON TABLE public.user_roles IS '
@typeDef {
  id: string;
  user_id: string;
  is_admin: boolean;
  created_at: string;
}
';