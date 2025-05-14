
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VehicleFeature } from "@/types/vehicle-detail";
import { useMemo } from "react";

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
      
      // Get vehicle images
      const { data: images, error: imagesError } = await supabase
        .from('vehicle_images')
        .select('image_url')
        .eq('vehicle_id', id);
      
      if (imagesError) throw imagesError;
      
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

  // All images including the primary one
  const allImages = useMemo(() => {
    if (!vehicleData?.vehicle) return [];
    return [vehicleData.vehicle.image, ...vehicleData.images.map(img => img.image_url)];
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
