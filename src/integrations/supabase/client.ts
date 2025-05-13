
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://aumzleiqvdkdjxxvaest.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1bXpsZWlxdmRrZGp4eHZhZXN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNTIxNTksImV4cCI6MjA2MjYyODE1OX0.OhQh8trlkyKgSAuNjZENJz2385iK3ytQ7XmPB0jo78I";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});

export const uploadVehicleImage = async (file: File, userId: string): Promise<string | null> => {
  try {
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;
    
    // Check if file is too large (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size);
      throw new Error('File size exceeds 5MB limit');
    }
    
    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadVehicleImage:', error);
    return null;
  }
};

// Function to save multiple vehicle images to the vehicle_images table
export const saveVehicleImages = async (vehicleId: string, imageUrls: string[]): Promise<boolean> => {
  try {
    // Create an array of objects to insert
    const imagesToInsert = imageUrls.map(imageUrl => ({
      vehicle_id: vehicleId,
      image_url: imageUrl
    }));
    
    // Insert all images
    const { error } = await supabase
      .from('vehicle_images')
      .insert(imagesToInsert);
    
    if (error) {
      console.error('Error saving vehicle images:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveVehicleImages:', error);
    return false;
  }
};

// Function to get all images for a vehicle
export const getVehicleImages = async (vehicleId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('vehicle_images')
      .select('image_url')
      .eq('vehicle_id', vehicleId);
      
    if (error || !data) {
      console.error('Error fetching vehicle images:', error);
      return [];
    }
    
    return data.map(item => item.image_url);
  } catch (error) {
    console.error('Error in getVehicleImages:', error);
    return [];
  }
};
