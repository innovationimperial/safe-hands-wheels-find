
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
    console.log(`Uploading image: ${file.name}, size: ${(file.size / 1024).toFixed(2)}KB`);
    
    // Generate a unique file name to avoid collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;
    
    // Check if file is too large (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error('File too large:', file.size);
      throw new Error('File size exceeds 5MB limit');
    }
    
    // Create the bucket if it doesn't exist yet - using a more robust approach
    try {
      // First check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const vehicleImagesBucket = buckets?.find(b => b.name === 'vehicle-images');
      
      if (!vehicleImagesBucket) {
        console.log("Creating 'vehicle-images' bucket");
        const { error: bucketError } = await supabase.storage.createBucket('vehicle-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB in bytes
        });
        
        if (bucketError) {
          console.error('Error creating bucket:', bucketError);
          // Continue anyway - bucket might exist but not be visible to this user
        }
      }
    } catch (bucketError) {
      console.error('Error checking/creating bucket:', bucketError);
      // Continue anyway - bucket might exist but with different permissions
    }
    
    // Upload the file to Supabase Storage with retry logic
    let uploadAttempts = 0;
    const maxAttempts = 3;
    let uploadError = null;
    let data = null;
    
    while (uploadAttempts < maxAttempts) {
      try {
        uploadAttempts++;
        console.log(`Upload attempt ${uploadAttempts} for ${file.name}`);
        
        const uploadResult = await supabase.storage
          .from('vehicle-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true // Changed to true to handle potential conflicts
          });
          
        if (uploadResult.error) {
          console.error(`Upload attempt ${uploadAttempts} failed:`, uploadResult.error);
          uploadError = uploadResult.error;
        } else {
          data = uploadResult.data;
          uploadError = null;
          break; // Exit the retry loop on success
        }
      } catch (err) {
        console.error(`Upload attempt ${uploadAttempts} exception:`, err);
        uploadError = err;
      }
      
      if (uploadAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      }
    }
      
    if (uploadError) {
      console.error('All upload attempts failed:', uploadError);
      throw uploadError;
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
    console.log(`Saving ${imageUrls.length} images for vehicle ${vehicleId}`);
    console.log("Image URLs to save:", JSON.stringify(imageUrls));
    
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
    
    // Verify we have valid images to insert
    if (!imageUrls || imageUrls.length === 0) {
      console.error("No valid image URLs provided to saveVehicleImages");
      return false;
    }
    
    // Create an array of objects to insert
    const imagesToInsert = imageUrls.map(imageUrl => ({
      vehicle_id: vehicleId,
      image_url: imageUrl
    }));
    
    console.log(`Inserting ${imagesToInsert.length} new image records:`, JSON.stringify(imagesToInsert));
    
    // Insert all images
    const { data, error } = await supabase
      .from('vehicle_images')
      .insert(imagesToInsert)
      .select();
    
    if (error) {
      console.error('Error saving vehicle images:', error);
      return false;
    }
    
    console.log(`Successfully saved ${imagesToInsert.length} images:`, data);
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
