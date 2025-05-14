
import { useState, useEffect } from 'react';
import { getVehicleImages, saveVehicleImages } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useVehicleImages(vehicleId?: string) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load images for an existing vehicle
  useEffect(() => {
    if (!vehicleId) return;
    
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const vehicleImages = await getVehicleImages(vehicleId);
        console.log(`Loaded ${vehicleImages.length} images for vehicle ${vehicleId}:`, vehicleImages);
        setImages(vehicleImages);
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
    if (images.length === 0) return true;
    
    console.log(`Saving ${images.length} images for vehicle ${newVehicleId}:`, images);
    
    try {
      // Make sure to clean any empty image URLs before saving
      const validImages = images.filter(url => url && url.trim() !== "");
      
      if (validImages.length === 0) return true;
      
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
