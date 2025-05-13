
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { VehicleFormValues } from '@/schemas/vehicleSchema';
import { useVehicleImages } from '@/hooks/use-vehicle-images';
import { mapFuelTypeToDatabase, DatabaseFuelType, DatabaseVehicleStatus } from '@/types/vehicle';

export function useVehicleForm(vehicleId?: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { images, saveImages } = useVehicleImages(vehicleId);
  
  // Create or update vehicle mutation
  const mutation = useMutation({
    mutationFn: async (values: VehicleFormValues) => {
      const user = supabase.auth.getUser();
      const userResponse = await user;
      
      if (!userResponse.data.user) {
        throw new Error("User not authenticated");
      }
      
      // Map form values to database values
      const mappedFuelType = mapFuelTypeToDatabase(values.fuel_type);
      
      // Map "Pending" to "Reserved" for database status
      let dbStatus: DatabaseVehicleStatus = values.status as DatabaseVehicleStatus;
      if (values.status === "Pending") {
        dbStatus = "Reserved";
      }

      const vehicleData = {
        ...values,
        fuel_type: mappedFuelType,
        status: dbStatus,
        user_id: userResponse.data.user.id,
        image: images.length > 0 ? images[0] : "", // Set first image as the main image
      };

      if (vehicleId) {
        // Update existing vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", vehicleId)
          .select()
          .single();

        if (error) throw error;
        await saveImages(vehicleId);
        return data;
      } else {
        // Create new vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .insert(vehicleData)
          .select()
          .single();

        if (error) throw error;
        await saveImages(data.id);
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast({
        title: `Vehicle ${vehicleId ? "updated" : "created"} successfully`,
        description: `The vehicle was ${vehicleId ? "updated" : "added"} to the database.`,
      });
      navigate("/admin/vehicles");
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

  return {
    images,
    isSubmitting: mutation.isPending,
    submitForm: mutation.mutate,
  };
}
