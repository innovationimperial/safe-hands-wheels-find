
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicleFormSchema, VehicleFormValues } from '@/schemas/vehicleSchema';
import { mapFuelTypeFromDatabase } from '@/types/vehicle';
import { useVehicleImages } from '@/hooks/use-vehicle-images';
import { useVehicleForm } from '@/hooks/use-vehicle-form';
import VehicleImageSection from '@/components/admin/vehicle-form/VehicleImageSection';
import VehicleBasicInfoFields from '@/components/admin/vehicle-form/VehicleBasicInfoFields';
import VehicleDropdownFields from '@/components/admin/vehicle-form/VehicleDropdownFields';
import VehicleFeaturedToggle from '@/components/admin/vehicle-form/VehicleFeaturedToggle';
import FormActions from '@/components/admin/vehicle-form/FormActions';
import { toast } from '@/hooks/use-toast';

const AdminVehicleForm = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { images, updateImages } = useVehicleForm(id);
  const { isSubmitting, submitForm } = useVehicleForm(id);

  // Define the form with validation schema
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: "",
      color: "",
      body_type: "Sedan",
      transmission: "Automatic",
      fuel_type: "Petrol",
      engine_capacity: "",
      doors: 4,
      location: "",
      status: "Available",
      featured: false,
    },
  });

  // Enhanced debug logs
  useEffect(() => {
    console.log("Current images in AdminVehicleForm:", images);
    console.log("Has images:", images && images.length > 0);
  }, [images]);

  // Fetch vehicle data if editing an existing vehicle
  const { isLoading } = useQuery({
    queryKey: ["vehicle", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          // Map status from database (Reserved) to form values (Pending)
          let mappedStatus = data.status;
          if (mappedStatus === "Reserved") {
            mappedStatus = "Pending";
          }
          
          // Map fuel_type from database to form values
          const mappedFuelType = mapFuelTypeFromDatabase(data.fuel_type);
          
          // Reset form with fetched data
          form.reset({
            title: data.title,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            color: data.color,
            body_type: data.body_type,
            transmission: data.transmission,
            fuel_type: mappedFuelType,
            engine_capacity: data.engine_capacity,
            doors: data.doors,
            location: data.location,
            status: mappedStatus,
            featured: data.featured,
          });
        }
      }
    }
  });

  // Handle form submission
  const onSubmit = (values: VehicleFormValues) => {
    // Log the image state before submission
    console.log("Images before submission:", images);
    
    // Check if at least one image is uploaded
    if (!images || images.length === 0) {
      console.error("No images uploaded. Cannot submit form.");
      toast({
        title: "Image Required",
        description: "Please upload at least one image for the vehicle",
        variant: "destructive"
      });
      return;
    }
    
    submitForm(values);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{id ? "Edit" : "Add"} Vehicle</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Vehicle Images */}
              <VehicleImageSection
                userId={user?.id || ""}
                images={images}
                updateImages={updateImages}
              />

              {/* Basic Information */}
              <VehicleBasicInfoFields form={form} />

              {/* Dropdown Fields */}
              <VehicleDropdownFields form={form} />

              {/* Featured Vehicle Toggle */}
              <VehicleFeaturedToggle form={form} />

              {/* Form Actions */}
              <FormActions
                isSubmitting={isSubmitting}
                isLoading={isLoading}
                isValid={images && images.length > 0}
                isEdit={!!id}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVehicleForm;
