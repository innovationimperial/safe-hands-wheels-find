
import { useCallback } from 'react';
import { saveVehicleImages } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useImageValidation } from '@/hooks/use-image-validation';

export function useImageSaving() {
  const { validateImages } = useImageValidation();
  
  // Save images for a vehicle
  const saveImages = useCallback(async (vehicleId: string, images: string[]): Promise<boolean> => {
    if (!vehicleId) {
      console.error("No vehicle ID provided for saving images");
      return false;
    }
    
    // Make sure to clean any empty image URLs before checking
    const validImages = validateImages(images);
    
    if (validImages.length === 0) {
      console.warn("No images to save for vehicle", vehicleId);
      return false;
    }
    
    console.log(`Saving ${validImages.length} images for vehicle ${vehicleId}:`, validImages);
    
    try {
      const success = await saveVehicleImages(vehicleId, validImages);
      
      if (!success) {
        console.error('Failed to save vehicle images to database');
        toast({
          title: "Error",
          description: "Failed to save vehicle images",
          variant: "destructive"
        });
        return false;
      }
      
      console.log(`Successfully saved ${validImages.length} images for vehicle ${vehicleId}`);
      return true;
    } catch (err) {
      console.error('Failed to save vehicle images:', err);
      toast({
        title: "Error",
        description: "Failed to save vehicle images",
        variant: "destructive"
      });
      return false;
    }
  }, [validateImages]);
  
  return { saveImages };
}
