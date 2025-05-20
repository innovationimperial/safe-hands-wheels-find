
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleFeature } from "@/types/vehicle-detail";
import { useMemo } from "react";
import { toast } from "@/hooks/use-toast";

export const useVehicleDetail = (id: string | undefined) => {
  const { data: vehicleData, isLoading, error } = useQuery({
    queryKey: ['vehicle-detail', id],
    queryFn: async () => {
      if (!id) throw new Error("Vehicle ID is required");
      
      // Get vehicle details
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (vehicleError) throw vehicleError;
      
      // Get vehicle images - retry with better error handling
      let images = [];
      try {
        console.log(`Fetching images for vehicle ${id} from vehicle_images table`);
        const { data: imageData, error: imagesError } = await supabase
          .from('vehicle_images')
          .select('image_url')
          .eq('vehicle_id', id);
        
        if (imagesError) {
          console.error("Error fetching vehicle images:", imagesError);
          // Do not show toast here as we'll still try to use the main image
        } else if (imageData && imageData.length > 0) {
          images = imageData;
          console.log(`Successfully retrieved ${imageData.length} images for vehicle ${id}:`, imageData);
        } else {
          console.log(`No additional images found in vehicle_images table for vehicle ${id}`);
        }
      } catch (imageError) {
        console.error("Exception fetching vehicle images:", imageError);
      }
      
      // Get vehicle features
      const { data: features, error: featuresError } = await supabase
        .from('vehicle_features')
        .select('category, feature, value')
        .eq('vehicle_id', id);
      
      if (featuresError) throw featuresError;
      
      return {
        vehicle,
        images: images || [],
        features: features || []
      };
    },
    enabled: !!id
  });
  
  // Group features by category
  const featuresByCategory = useMemo(() => {
    if (!vehicleData?.features) return {};
    
    return vehicleData.features.reduce((acc: Record<string, VehicleFeature[]>, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    }, {});
  }, [vehicleData?.features]);

  // All images including the primary one, filter out any empty strings
  const allImages = useMemo(() => {
    if (!vehicleData?.vehicle) return [];
    
    // Always start with the main image if it exists
    const mainImage = vehicleData.vehicle.image;
    const additionalImages = vehicleData.images.map(img => img.image_url).filter(Boolean);
    
    console.log('Processing vehicle images:', {
      mainImage,
      additionalImagesCount: additionalImages.length,
      additionalImages
    });
    
    // Create a combined array of images, ensuring no duplicates and no empty strings
    const uniqueImages = new Set<string>();
    
    // Add main image if it exists and is not empty
    if (mainImage && mainImage.trim() !== '') {
      uniqueImages.add(mainImage);
    }
    
    // Add additional images
    additionalImages.forEach(img => {
      if (img && img.trim() !== '') {
        uniqueImages.add(img);
      }
    });
    
    const allUniqueImages = Array.from(uniqueImages);
    console.log(`Final image list contains ${allUniqueImages.length} unique images:`, allUniqueImages);
    
    if (allUniqueImages.length === 0) {
      console.warn("No images found for vehicle!");
    }
    
    return allUniqueImages;
  }, [vehicleData]);
  
  return {
    vehicle: vehicleData?.vehicle,
    allImages,
    featuresByCategory,
    isLoading,
    error
  };
};

export default useVehicleDetail;
