
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/layout/AdminLayout';
import MultipleImageUploader from '@/components/admin/MultipleImageUploader';
import { useVehicleImages } from '@/hooks/use-vehicle-images';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  year: z.coerce.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  mileage: z.string().min(1, "Mileage is required"),
  color: z.string().min(1, "Color is required"),
  body_type: z.enum(["Sedan", "SUV", "Truck", "Coupe", "Wagon", "Van", "Convertible", "Hatchback"]),
  transmission: z.enum(["Automatic", "Manual"]),
  fuel_type: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"]),
  engine_capacity: z.string().min(1, "Engine capacity is required"),
  doors: z.coerce.number().min(1, "Doors must be at least 1"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["Available", "Pending", "Sold"]),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminVehicleForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { images, updateImages, saveImages } = useVehicleImages(id);

  // Define the form with validation schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
        // Reset form with fetched data
        form.reset({
          title: data.title,
          year: data.year,
          price: data.price,
          mileage: data.mileage,
          color: data.color,
          body_type: data.body_type,
          transmission: data.transmission,
          fuel_type: data.fuel_type,
          engine_capacity: data.engine_capacity,
          doors: data.doors,
          location: data.location,
          status: data.status,
          featured: data.featured,
        });
      }
    },
  });

  // Create or update vehicle mutation
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!user) throw new Error("User not authenticated");

      const vehicleData = {
        ...values,
        user_id: user.id,
        image: images.length > 0 ? images[0] : "", // Set first image as the main image
      };

      if (id) {
        // Update existing vehicle
        const { data, error } = await supabase
          .from("vehicles")
          .update(vehicleData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        await saveImages(id);
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
        title: `Vehicle ${id ? "updated" : "created"} successfully`,
        description: `The vehicle was ${id ? "updated" : "added"} to the database.`,
      });
      navigate("/admin/vehicles");
    },
    onError: (error) => {
      console.error("Error saving vehicle:", error);
      toast({
        title: "Error",
        description: `Failed to ${id ? "update" : "create"} vehicle. Please try again.`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{id ? "Edit" : "Add"} Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Vehicle Images */}
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Vehicle Images <span className="text-red-500">*</span>
                  </label>
                  <MultipleImageUploader
                    userId={user?.id || ""}
                    onImagesUploaded={updateImages}
                    existingImages={images}
                    maxImages={5}
                  />
                  {images.length === 0 && (
                    <p className="text-sm text-red-500">
                      At least one image is required
                    </p>
                  )}
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="2023 Honda Civic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="25000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            placeholder="2023"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                          <Input placeholder="15,000 km" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Red" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="New York, NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engine_capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Capacity</FormLabel>
                        <FormControl>
                          <Input placeholder="2.0L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doors</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dropdown Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="body_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select body type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Truck">Truck</SelectItem>
                            <SelectItem value="Coupe">Coupe</SelectItem>
                            <SelectItem value="Wagon">Wagon</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Convertible">
                              Convertible
                            </SelectItem>
                            <SelectItem value="Hatchback">Hatchback</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fuel_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Petrol">Petrol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Featured Vehicle Toggle */}
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Featured Vehicle</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/vehicles")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending || isLoading || images.length === 0}
                  >
                    {mutation.isPending ? "Saving..." : id ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVehicleForm;
