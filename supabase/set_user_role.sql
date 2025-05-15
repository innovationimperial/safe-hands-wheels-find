
-- Create a function to safely update user role
-- This will be executed later via lov-sql block
CREATE OR REPLACE FUNCTION public.set_user_role(user_id UUID, new_role TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET role = new_role
  WHERE id = user_id;
END;
$$;
