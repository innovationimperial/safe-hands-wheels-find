
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VehicleFormValues } from '@/schemas/vehicleSchema';
import { mapFuelTypeToDatabase, DatabaseFuelType, DatabaseVehicleStatus } from '@/types/vehicle';
import { useImageSaving } from '@/hooks/use-image-saving';

export function useVehicleSubmission() {
  const { saveImages } = useImageSaving();
  
  const prepareVehicleData = useCallback(async (
    values: VehicleFormValues,
    images: string[],
    vehicleId?: string,
    isDealerMode = false
  ) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error("Authentication error:", authError);
        throw new Error("User not authenticated");
      }
      
      console.log("Current authenticated user:", user.id);
      console.log("Current images:", images);
      
      // Map form values to database values
      const mappedFuelType = mapFuelTypeToDatabase(values.fuel_type);
      
      // Map "Pending" to "Reserved" for database status
      let dbStatus: DatabaseVehicleStatus = values.status as DatabaseVehicleStatus;
      if (values.status === "Pending") {
        dbStatus = "Reserved";
      }

      // Validate images - ensure they are properly filtered and non-empty
      const validImages = images.filter(url => url && url.trim() !== "");

      // Set the first image as the main vehicle image
      const mainImage = validImages[0];
      console.log("Setting main vehicle image:", mainImage);

      const vehicleData = {
        title: values.title,
        year: values.year,
        price: values.price,
        mileage: values.mileage,
        color: values.color,
        body_type: values.body_type,
        transmission: values.transmission,
        engine_capacity: values.engine_capacity,
        doors: values.doors,
        location: values.location,
        fuel_type: mappedFuelType,
        status: dbStatus,
        user_id: user.id, // Always use the current user's ID
        image: mainImage, // Set first image as the main image
        featured: values.featured
      };

      console.log("Submitting vehicle data:", vehicleData);

      if (vehicleId) {
        // For updates, ensure the user can only update their own vehicles unless they're admin
        if (isDealerMode) {
          // Check if vehicle belongs to this user
          const { data: existingVehicle, error: vehicleError } = await supabase
            .from("vehicles")
            .select("user_id")
            .eq("id", vehicleId)
            .single();
            
          if (vehicleError) {
            throw new Error("Failed to verify vehicle ownership");
          }
          
          if (existingVehicle.user_id !== user.id) {
            throw new Error("You don't have permission to edit this vehicle");
          }
        }
        
        // Update existing vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", vehicleId)
          .select()
          .single();

        if (error) {
          console.error("Error updating vehicle:", error);
          throw error;
        }
        
        console.log("Vehicle updated successfully:", data);
        
        // Save all images
        const imagesSaved = await saveImages(vehicleId, validImages);
        if (!imagesSaved) {
          console.error("Failed to save vehicle images");
          toast({
            title: "Warning",
            description: "Vehicle was updated but there was an issue with the images",
            variant: "destructive"
          });
        } else {
          console.log("All vehicle images saved successfully");
        }
        
        return data;
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .insert(vehicleData)
          .select()
          .single();

        if (error) {
          console.error("Error creating vehicle:", error);
          throw error;
        }
        
        if (data) {
          console.log("Vehicle created successfully:", data);
          
          // Save all images
          const imagesSaved = await saveImages(data.id, validImages);
          if (!imagesSaved) {
            console.error("Failed to save vehicle images");
            toast({
              title: "Warning",
              description: "Vehicle was created but there was an issue with the images",
              variant: "destructive"
            });
          } else {
            console.log("All vehicle images saved successfully");
          }
        }
        
        return data;
      }
    } catch (error) {
      console.error("Error in prepareVehicleData:", error);
      throw error;
    }
  }, [saveImages]);
  
  return { prepareVehicleData };
}
