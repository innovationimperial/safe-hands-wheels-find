
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
    
    try {
      const success = await saveVehicleImages(newVehicleId, images);
      
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to save vehicle images",
          variant: "destructive"
        });
        return false;
      }
      
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
    setImages(newImages);
  };
  
  return {
    images,
    isLoading,
    error,
    updateImages,
    saveImages
  };
}
