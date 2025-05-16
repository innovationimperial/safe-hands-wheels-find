
import { useState, useEffect } from 'react';
import { getVehicleImages, saveVehicleImages } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useVehicleImages(vehicleId?: string) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load images for an existing vehicle
  useEffect(() => {
    if (!vehicleId) {
      console.log("No vehicleId provided, skipping image fetch");
      return;
    }
    
    const loadImages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(`Fetching images for vehicle ${vehicleId}`);
        const vehicleImages = await getVehicleImages(vehicleId);
        console.log(`Loaded ${vehicleImages.length} images for vehicle ${vehicleId}:`, vehicleImages);
        
        // Filter out any empty or invalid image URLs before setting state
        const validImages = vehicleImages.filter(url => url && url.trim() !== "");
        console.log(`After filtering: ${validImages.length} valid images`);
        
        setImages(validImages);
      } catch (err) {
        console.error('Failed to load vehicle images:', err);
        setError('Failed to load vehicle images');
        toast({
          title: "Error",
          description: "Failed to load vehicle images",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImages();
  }, [vehicleId]);
  
  // Save images for a vehicle
  const saveImages = async (newVehicleId: string): Promise<boolean> => {
    if (!newVehicleId) {
      console.error("No vehicle ID provided for saving images");
      return false;
    }
    
    // Make sure to clean any empty image URLs before checking
    const validImages = images.filter(url => url && url.trim() !== "");
    
    if (validImages.length === 0) {
      console.warn("No images to save for vehicle", newVehicleId);
      return false;
    }
    
    console.log(`Saving ${validImages.length} images for vehicle ${newVehicleId}:`, validImages);
    
    try {
      const success = await saveVehicleImages(newVehicleId, validImages);
      
      if (!success) {
        console.error('Failed to save vehicle images to database');
        toast({
          title: "Error",
          description: "Failed to save vehicle images",
          variant: "destructive"
        });
        return false;
      }
      
      console.log(`Successfully saved ${validImages.length} images for vehicle ${newVehicleId}`);
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
  };
  
  // Update the images list
  const updateImages = (newImages: string[]) => {
    // Filter out any empty strings or undefined values
    const validImages = newImages.filter(url => url && url.trim() !== "");
    console.log('Updating images array:', validImages);
    setImages(validImages);
  };
  
  return {
    images,
    isLoading,
    error,
    updateImages,
    saveImages
  };
}
