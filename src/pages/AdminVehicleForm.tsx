
import React from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vehicleFormSchema } from '@/schemas/vehicleSchema';
import { mapFuelTypeFromDatabase } from '@/types/vehicle';
import { useVehicleImages } from '@/hooks/use-vehicle-images';
import { useVehicleForm } from '@/hooks/use-vehicle-form';
import VehicleImageSection from '@/components/admin/vehicle-form/VehicleImageSection';
import VehicleBasicInfoFields from '@/components/admin/vehicle-form/VehicleBasicInfoFields';
import VehicleDropdownFields from '@/components/admin/vehicle-form/VehicleDropdownFields';
import VehicleFeaturedToggle from '@/components/admin/vehicle-form/VehicleFeaturedToggle';
import FormActions from '@/components/admin/vehicle-form/FormActions';

const AdminVehicleForm = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { images, updateImages } = useVehicleImages(id);
  const { isSubmitting, submitForm } = useVehicleForm(id);

  // Define the form with validation schema
  const form = useForm({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      title: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: "",
      color: "",
      body_type: "Sedan" as const,
      transmission: "Automatic" as const,
      fuel_type: "Petrol" as const,
      engine_capacity: "",
      doors: 4,
      location: "",
      status: "Available" as const,
      featured: false,
    },
  });

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
    onSuccess: (data) => {
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
    },
  });

  // Handle form submission
  const onSubmit = (values) => {
    // Check if at least one image is uploaded
    if (images.length === 0) {
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
                isValid={images.length > 0}
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
