
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
      
      console.log(`Fetching details for vehicle ${id}`);
      
      // Get vehicle details
      const { data: vehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (vehicleError) {
        console.error("Error fetching vehicle details:", vehicleError);
        throw vehicleError;
      }
      
      // Get ALL vehicle images from the dedicated table
      const { data: vehicleImages, error: imagesError } = await supabase
        .from('vehicle_images')
        .select('image_url')
        .eq('vehicle_id', id);
      
      let images = [];
      if (imagesError) {
        console.error("Error fetching vehicle images:", imagesError);
        toast({
          title: "Warning",
          description: "Could not load additional vehicle images",
          variant: "destructive"
        });
      } else {
        images = vehicleImages || [];
        console.log(`Retrieved ${images.length} images for vehicle ${id}`);
      }
      
      // Get vehicle features
      const { data: features, error: featuresError } = await supabase
        .from('vehicle_features')
        .select('category, feature, value')
        .eq('vehicle_id', id);
      
      if (featuresError) {
        console.error("Error fetching vehicle features:", featuresError);
        throw featuresError;
      }
      
      return {
        vehicle,
        images,
        features: features || []
      };
    },
    enabled: !!id,
    retry: 1,
    onSettled: (data, error) => {
      if (error) {
        console.error("Vehicle detail query error:", error);
        toast({
          title: "Error",
          description: "Failed to load vehicle details",
          variant: "destructive"
        });
      }
    }
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
    
    // Start with an empty set to ensure no duplicates
    const uniqueImages = new Set<string>();
    
    // Add the main image from the vehicles table first (if it exists)
    const mainImage = vehicleData.vehicle.image;
    if (mainImage && mainImage.trim() !== '') {
      uniqueImages.add(mainImage);
    }
    
    // Add all additional images from the vehicle_images table
    if (vehicleData.images && vehicleData.images.length > 0) {
      vehicleData.images.forEach(img => {
        if (img.image_url && img.image_url.trim() !== '') {
          uniqueImages.add(img.image_url);
        }
      });
    }
    
    const imageArray = Array.from(uniqueImages);
    console.log(`Final image list contains ${imageArray.length} unique images`);
    
    if (imageArray.length === 0) {
      console.warn("No images found for this vehicle");
    }
    
    return imageArray;
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
