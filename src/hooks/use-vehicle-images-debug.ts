
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility hook to debug vehicle image issues
 * This can be used in the console for troubleshooting
 */
export const checkVehicleImages = async (vehicleId: string) => {
  console.group(`Debugging vehicle images for vehicle ID: ${vehicleId}`);
  
  try {
    // 1. Check if the vehicle exists
    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, title, image')
      .eq('id', vehicleId)
      .single();
    
    if (vehicleError) {
      console.error("Vehicle not found:", vehicleError);
      return { success: false, error: vehicleError };
    }
    
    console.log("Vehicle found:", vehicle);
    
    // 2. Check for main image
    console.log("Main image:", vehicle.image || "None");
    
    // 3. Check for additional images
    const { data: vehicleImages, error: imagesError } = await supabase
      .from('vehicle_images')
      .select('*')
      .eq('vehicle_id', vehicleId);
    
    if (imagesError) {
      console.error("Error fetching vehicle images:", imagesError);
      return { success: false, error: imagesError };
    }
    
    console.log("Additional images count:", vehicleImages?.length || 0);
    console.log("Additional images:", vehicleImages);
    
    // 4. Check RLS policies by attempting different queries
    console.log("Testing RLS policies...");
    
    // Try to get count of all vehicle images (should work if RLS allows)
    const { count, error: countError } = await supabase
      .from('vehicle_images')
      .select('*', { count: 'exact', head: true })
      .eq('vehicle_id', vehicleId);
    
    if (countError) {
      console.error("Count query failed:", countError);
    } else {
      console.log("RLS count result:", count);
    }
    
    return {
      success: true,
      vehicle,
      mainImage: vehicle.image,
      additionalImages: vehicleImages || [],
      totalCount: count
    };
  } catch (error) {
    console.error("Debug function error:", error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};

/**
 * Utility to force save images for debugging
 */
export const forceSaveVehicleImages = async (vehicleId: string, imageUrls: string[]) => {
  console.group(`Force saving vehicle images for vehicle ID: ${vehicleId}`);
  
  try {
    // Validate inputs
    if (!vehicleId || !imageUrls || imageUrls.length === 0) {
      console.error("Invalid inputs provided");
      return { success: false, error: "Invalid vehicle ID or image URLs" };
    }
    
    // First delete existing
    console.log("Deleting existing images...");
    const { error: deleteError } = await supabase
      .from('vehicle_images')
      .delete()
      .eq('vehicle_id', vehicleId);
    
    if (deleteError) {
      console.error("Error deleting existing images:", deleteError);
      return { success: false, error: deleteError };
    }
    
    // Insert new ones
    const imagesToInsert = imageUrls.map(url => ({
      vehicle_id: vehicleId,
      image_url: url
    }));
    
    console.log("Inserting new images:", imagesToInsert);
    const { data, error } = await supabase
      .from('vehicle_images')
      .insert(imagesToInsert)
      .select();
    
    if (error) {
      console.error("Error inserting images:", error);
      return { success: false, error };
    }
    
    console.log("Successfully saved images:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Force save function error:", error);
    return { success: false, error };
  } finally {
    console.groupEnd();
  }
};

// Make functions available globally for console debugging
if (typeof window !== 'undefined') {
  (window as any).checkVehicleImages = checkVehicleImages;
  (window as any).forceSaveVehicleImages = forceSaveVehicleImages;
}
