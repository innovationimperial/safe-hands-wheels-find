
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
    console.log(`Uploading image: ${file.name}, size: ${(file.size / 1024).toFixed(2)}KB, userId: ${userId}`);
    
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;
    
    // Check if file is too large (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size);
      throw new Error('File size exceeds 5MB limit');
    }
    
    // First check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    console.log('Available buckets:', buckets);
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return null;
    }
    
    // Create bucket if it doesn't exist
    const vehicleImagesBucket = buckets?.find(b => b.name === 'vehicle-images');
    
    if (!vehicleImagesBucket) {
      console.log("Creating 'vehicle-images' bucket");
      const { data: newBucket, error: bucketError } = await supabase.storage.createBucket('vehicle-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB in bytes
      });
      
      if (bucketError) {
        console.error('Error creating bucket:', bucketError);
        return null;
      }
      
      console.log('Successfully created bucket:', newBucket);
    }
    
    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite existing files with same name
      });
      
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return null;
    }
    
    console.log('File uploaded successfully:', data?.path);
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);
      
    console.log('Generated public URL:', publicUrl);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadVehicleImage:', error);
    return null;
  }
};

// Function to save multiple vehicle images to the vehicle_images table
export const saveVehicleImages = async (vehicleId: string, imageUrls: string[]): Promise<boolean> => {
  try {
    console.log(`Saving ${imageUrls.length} images for vehicle ${vehicleId}:`, imageUrls);
    
    if (!vehicleId || !imageUrls.length) {
      console.error('Missing vehicleId or imageUrls');
      return false;
    }
    
    // First, delete any existing images for this vehicle
    console.log(`Removing existing images for vehicle ${vehicleId}`);
    const { error: deleteError } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (deleteError) {
      console.error('Error deleting existing vehicle images:', deleteError);
      return false;
    }
    
    // Create an array of objects to insert
    const imagesToInsert = imageUrls.map(imageUrl => ({
      vehicle_id: vehicleId,
      image_url: imageUrl
    }));
    
    console.log(`Inserting ${imagesToInsert.length} new image records`);
    
    // Insert all images
    const { error, data } = await supabase
      .from('vehicle_images')
      .insert(imagesToInsert)
      .select();
    
    if (error) {
      console.error('Error saving vehicle images:', error);
      return false;
    }
    
    console.log(`Successfully saved ${data?.length} images:`, data);
    return true;
  } catch (error) {
    console.error('Error in saveVehicleImages:', error);
    return false;
  }
};

// Function to get all images for a vehicle
export const getVehicleImages = async (vehicleId: string): Promise<string[]> => {
  try {
    console.log(`Fetching images for vehicle ${vehicleId}`);
    
    if (!vehicleId) {
      console.error('No vehicleId provided');
      return [];
    }
    
    const { data, error } = await supabase
      .from('vehicle_images')
      .select('image_url')
      .eq('vehicle_id', vehicleId);
      
    if (error) {
      console.error('Error fetching vehicle images:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log(`No images found for vehicle ${vehicleId}`);
      return [];
    }
    
    const images = data.map(item => item.image_url);
    console.log(`Found ${images.length} images for vehicle ${vehicleId}:`, images);
    
    return images;
  } catch (error) {
    console.error('Error in getVehicleImages:', error);
    return [];
  }
};
