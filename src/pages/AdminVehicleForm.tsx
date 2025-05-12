
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Save, X, Upload, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { vehicles } from "@/data/vehicles";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  year: z.coerce.number().min(1900, { message: "Year must be after 1900." }).max(new Date().getFullYear() + 1),
  mileage: z.string().min(1, { message: "Mileage is required." }),
  fuelType: z.string().min(1, { message: "Fuel type is required." }),
  transmission: z.string().min(1, { message: "Transmission is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  featured: z.boolean().default(false),
  image: z.string().min(1, { message: "Primary image URL is required." }),
  // New field for additional images
  additionalImages: z.array(z.string()).default([]),
  // Additional fields for detailed specs
  bodyType: z.string().min(1, { message: "Body type is required." }),
  doors: z.coerce.number().min(1, { message: "Number of doors is required." }),
  color: z.string().min(1, { message: "Color is required." }),
  engineCapacity: z.string().min(1, { message: "Engine capacity is required." }),
  // Comfort features
  airConditioning: z.boolean().default(false),
  leatherInterior: z.boolean().default(false),
  electricWindows: z.boolean().default(false),
  cruiseControl: z.boolean().default(false),
  dualZoneClimate: z.boolean().default(false),
  pushToStart: z.boolean().default(false),
  // Safety features
  absBreaks: z.boolean().default(false),
  parkingSensors: z.boolean().default(false),
  parkAssist: z.boolean().default(false),
  rearCamera: z.boolean().default(false),
  centralLocking: z.boolean().default(false),
  // Tech features
  navigation: z.boolean().default(false),
  radio: z.boolean().default(false),
  automaticBoot: z.boolean().default(false),
  steeringControls: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminVehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== undefined;
  const [imageInputValue, setImageInputValue] = useState("");
  
  // Find vehicle if editing
  const existingVehicle = isEditing 
    ? vehicles.find(v => v.id === parseInt(id || "0")) 
    : undefined;
  
  // Default values for form
  const defaultValues: Partial<FormValues> = isEditing && existingVehicle
    ? {
        title: existingVehicle.title,
        price: existingVehicle.price,
        year: existingVehicle.year,
        mileage: existingVehicle.mileage,
        fuelType: existingVehicle.fuelType,
        transmission: existingVehicle.transmission,
        location: existingVehicle.location,
        featured: existingVehicle.featured,
        image: existingVehicle.image,
        additionalImages: Array(4).fill(existingVehicle.image), // Mock data for additional images
        // Additional mock data since it doesn't exist in the original data
        bodyType: "SUV",
        doors: 4,
        color: "White",
        engineCapacity: "2.0 ltr",
        airConditioning: true,
        leatherInterior: true,
        electricWindows: true,
        cruiseControl: true,
        dualZoneClimate: true,
        pushToStart: true,
        absBreaks: true,
        parkingSensors: true,
        parkAssist: true,
        rearCamera: true,
        centralLocking: true,
        navigation: true,
        radio: true,
        automaticBoot: true,
        steeringControls: true,
      }
    : {
        featured: false,
        additionalImages: [],
        airConditioning: false,
        leatherInterior: false,
        electricWindows: false,
        cruiseControl: false,
        dualZoneClimate: false,
        pushToStart: false,
        absBreaks: false,
        parkingSensors: false,
        parkAssist: false,
        rearCamera: false,
        centralLocking: false,
        navigation: false,
        radio: false,
        automaticBoot: false,
        steeringControls: false,
      };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    
    // This is just a mock - in a real app this would connect to an API
    toast({
      title: isEditing ? "Vehicle updated!" : "Vehicle created!",
      description: `${data.title} has been ${isEditing ? 'updated' : 'added'} successfully.`,
    });
    
    setTimeout(() => {
      navigate("/admin/vehicles");
    }, 1500);
  };
  
  // Function to add a new image URL to the additionalImages array
  const addImageUrl = () => {
    if (!imageInputValue.trim()) return;
    
    const currentImages = form.getValues("additionalImages") || [];
    form.setValue("additionalImages", [...currentImages, imageInputValue]);
    setImageInputValue("");
  };
  
  // Function to remove an image from the additionalImages array
  const removeImage = (index: number) => {
    const currentImages = form.getValues("additionalImages") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("additionalImages", newImages);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/vehicles")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit" : "Add"} Vehicle</h1>
        </div>
        
        <div className="bg-white rounded-md border shadow-sm p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic">
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="specs">Specifications</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Ford Mustang GT" {...field} />
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
                            <Input type="number" placeholder="e.g. 45000" {...field} />
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
                            <Input type="number" placeholder="e.g. 2023" {...field} />
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
                            <Input placeholder="e.g. 15,000 mi" {...field} />
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
                            <Input placeholder="e.g. Los Angeles, CA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/car.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="fuelType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Type</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              className="flex flex-wrap gap-4" 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              {["Gasoline", "Diesel", "Hybrid", "Electric"].map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={`fuel-${type}`} />
                                  <label htmlFor={`fuel-${type}`}>{type}</label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
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
                          <FormControl>
                            <RadioGroup 
                              className="flex flex-wrap gap-4" 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              {["Automatic", "Manual", "PDK", "CVT"].map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={`trans-${type}`} />
                                  <label htmlFor={`trans-${type}`}>{type}</label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Vehicle</FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Featured vehicles will be displayed prominently on the homepage.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* New Images Tab */}
                <TabsContent value="images" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Additional Images</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add multiple images to showcase your vehicle from different angles.
                    </p>
                    
                    <div className="flex gap-2 mb-4">
                      <Input 
                        placeholder="Enter image URL" 
                        value={imageInputValue}
                        onChange={(e) => setImageInputValue(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="button" onClick={addImageUrl}>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {form.watch("additionalImages")?.map((img, index) => (
                        <div key={index} className="relative group border rounded-md overflow-hidden">
                          <div className="aspect-ratio-4/3 bg-gray-100 w-full h-48 relative">
                            {img ? (
                              <img src={img} alt={`Vehicle image ${index + 1}`} className="w-full h-full object-cover" />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ImageIcon className="h-12 w-12 text-gray-300" />
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="p-2 bg-gray-50 text-xs truncate">{img}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="specs" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bodyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Body Type</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              className="flex flex-wrap gap-4" 
                              onValueChange={field.onChange} 
                              value={field.value}
                            >
                              {["SUV", "Sedan", "Hatchback", "Coupe", "Truck", "Van"].map(type => (
                                <div key={type} className="flex items-center space-x-2">
                                  <RadioGroupItem value={type} id={`body-${type}`} />
                                  <label htmlFor={`body-${type}`}>{type}</label>
                                </div>
                              ))}
                            </RadioGroup>
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
                          <FormLabel>Number of Doors</FormLabel>
                          <FormControl>
                            <RadioGroup 
                              className="flex gap-4" 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                            >
                              {[2, 3, 4, 5].map(num => (
                                <div key={num} className="flex items-center space-x-2">
                                  <RadioGroupItem value={num.toString()} id={`doors-${num}`} />
                                  <label htmlFor={`doors-${num}`}>{num}</label>
                                </div>
                              ))}
                            </RadioGroup>
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
                            <Input placeholder="e.g. White" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="engineCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engine Capacity</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2.0 ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Comfort & Convenience</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "airConditioning", label: "Air Conditioning" },
                        { name: "leatherInterior", label: "Leather Interior" },
                        { name: "electricWindows", label: "Electric Windows" },
                        { name: "cruiseControl", label: "Cruise Control" },
                        { name: "dualZoneClimate", label: "Dual Zone Climate Control" },
                        { name: "pushToStart", label: "Push to Start" },
                      ].map((feature) => (
                        <FormField
                          key={feature.name}
                          control={form.control}
                          name={feature.name as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Safety Features</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "absBreaks", label: "ABS Brakes" },
                        { name: "parkingSensors", label: "Parking Sensors" },
                        { name: "parkAssist", label: "Park Assist" },
                        { name: "rearCamera", label: "Rear View Camera" },
                        { name: "centralLocking", label: "Central Locking" },
                      ].map((feature) => (
                        <FormField
                          key={feature.name}
                          control={form.control}
                          name={feature.name as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Technology</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        { name: "navigation", label: "Navigation" },
                        { name: "radio", label: "Radio" },
                        { name: "automaticBoot", label: "Automatic Boot" },
                        { name: "steeringControls", label: "Audio Controls on Steering Wheel" },
                      ].map((feature) => (
                        <FormField
                          key={feature.name}
                          control={form.control}
                          name={feature.name as any}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {feature.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-4 justify-end pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/admin/vehicles")}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? "Update" : "Save"} Vehicle
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminVehicleForm;
