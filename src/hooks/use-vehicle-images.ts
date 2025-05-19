
import { useState, useEffect, useCallback } from 'react';
import { getVehicleImages } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useImageValidation } from '@/hooks/use-image-validation';
import { useImageSaving } from '@/hooks/use-image-saving';

export function useVehicleImages(vehicleId?: string) {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use more focused hooks
  const { validateImages } = useImageValidation();
  const { saveImages } = useImageSaving();
  
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
        const validImages = validateImages(vehicleImages);
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
  }, [vehicleId, validateImages]);
  
  // Update the images list
  const updateImages = useCallback((newImages: string[]) => {
    // Filter out any empty strings or undefined values
    const validImages = validateImages(newImages);
    console.log('Updating images array:', validImages);
    setImages(validImages);
  }, [validateImages]);
  
  return {
    images,
    isLoading,
    error,
    updateImages,
    saveImages
  };
}
