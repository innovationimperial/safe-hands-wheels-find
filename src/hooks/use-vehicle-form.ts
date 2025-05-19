
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { VehicleFormValues } from '@/schemas/vehicleSchema';
import { useVehicleSubmission } from '@/hooks/use-vehicle-submission';
import { useImageValidation } from '@/hooks/use-image-validation';

export function useVehicleForm(vehicleId?: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);
  const { hasValidImages, validateImages } = useImageValidation();
  const { prepareVehicleData } = useVehicleSubmission();
  
  // Determine if we're in dealer mode vs admin mode
  const isDealerMode = location.pathname.startsWith('/dealer');
  
  // Create or update vehicle mutation
  const mutation = useMutation({
    mutationFn: async (values: VehicleFormValues) => {
      console.log("Submitting form with images:", images);
      
      // Validate images - ensure they are properly filtered and non-empty
      if (!hasValidImages(images)) {
        console.error("No valid images available for vehicle");
        toast({
          title: "Image Required",
          description: "Please upload at least one image for the vehicle",
          variant: "destructive"
        });
        return null;
      }
      
      // Prepare and submit vehicle data
      return await prepareVehicleData(values, images, vehicleId, isDealerMode);
    },
    onSuccess: (data) => {
      if (!data) return; // Handle case where we returned null due to validation
      
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: `Vehicle ${vehicleId ? "updated" : "created"} successfully`,
        description: `The vehicle was ${vehicleId ? "updated" : "added"} to the database.`,
      });
      
      // Navigate to the appropriate dashboard based on user role
      if (isDealerMode) {
        navigate("/dealer/dashboard");
      } else {
        navigate("/admin/vehicles");
      }
    },
    onError: (error) => {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description: `Failed to ${vehicleId ? "update" : "create"} vehicle. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Function to update images from child components
  const updateImages = (newImages: string[]) => {
    const validImages = validateImages(newImages);
    console.log("use-vehicle-form: Updating images:", validImages);
    setImages(validImages);
  };

  return {
    images,
    updateImages,
    isSubmitting: mutation.isPending,
    submitForm: mutation.mutate,
  };
}
