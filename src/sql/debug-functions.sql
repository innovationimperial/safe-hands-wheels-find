
-- This is an SQL function that would need to be added to the database for debugging
-- Save this file for reference, but it needs to be run manually in the SQL editor

CREATE OR REPLACE FUNCTION public.debug_get_vehicle_images(v_id UUID)
RETURNS TABLE (id UUID, vehicle_id UUID, image_url TEXT, created_at TIMESTAMPTZ)
LANGUAGE SQL SECURITY DEFINER AS $$
  SELECT id, vehicle_id, image_url, created_at
  FROM vehicle_images
  WHERE vehicle_id = v_id;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.debug_get_vehicle_images(UUID) TO authenticated;
