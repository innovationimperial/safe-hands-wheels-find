
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { 
  ChevronLeft, 
  Check, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Share2,
  Loader2,
  AlertCircle,
  Mail
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Vehicle {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: string;
  fuel_type: string;
  transmission: string;
  location: string;
  featured: boolean;
  image: string;
  body_type: string;
  doors: number;
  color: string;
  engine_capacity: string;
}

interface VehicleImage {
  image_url: string;
}

interface VehicleFeature {
  category: string;
  feature: string;
  value: boolean;
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch vehicle data from Supabase
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
    }
  });
  
  // Group features by category
  const featuresByCategory = React.useMemo(() => {
    if (!vehicleData?.features) return {};
    
    return vehicleData.features.reduce((acc: Record<string, VehicleFeature[]>, feature) => {
      if (!acc[feature.category]) {
        acc[feature.category] = [];
      }
      acc[feature.category].push(feature);
      return acc;
    }, {});
  }, [vehicleData?.features]);
  
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4">Loading vehicle details...</p>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (error || !vehicleData) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-12 text-red-500">
          <AlertCircle className="h-8 w-8" />
          <p className="mt-4">Error loading vehicle details. Please try again.</p>
          <Link to="/buy-car" className="mt-4">
            <Button variant="outline">Back to listings</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  const { vehicle, images } = vehicleData;
  
  // All images including the primary one
  const allImages = [vehicle.image, ...images.map(img => img.image_url)];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to="/buy-car" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to listings
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Images */}
          <div className="col-span-2">
            <div className="mb-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {allImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden">
                        <img 
                          src={image} 
                          alt={`${vehicle.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
            
            <div className="flex border-b mb-6">
              <button 
                className={`px-4 py-3 text-sm font-medium ${activeTab === "overview" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button 
                className={`px-4 py-3 text-sm font-medium ${activeTab === "features" ? "text-primary border-b-2 border-primary" : "text-gray-500"}`}
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
            </div>
            
            {activeTab === "overview" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Vehicle Overview</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Make/Model</span>
                      <p className="font-medium">{vehicle.title}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Year</span>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Mileage</span>
                      <p className="font-medium">{vehicle.mileage}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Fuel Type</span>
                      <p className="font-medium">{vehicle.fuel_type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Transmission</span>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Body Type</span>
                      <p className="font-medium">{vehicle.body_type}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Color</span>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Engine</span>
                      <p className="font-medium">{vehicle.engine_capacity}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Doors</span>
                      <p className="font-medium">{vehicle.doors}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <span className="text-gray-500 text-sm">Location</span>
                      <p className="font-medium">{vehicle.location}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600">
                    Experience the perfect blend of performance and luxury with this {vehicle.year} {vehicle.title}. 
                    With only {vehicle.mileage} on the odometer, this {vehicle.color} beauty is in excellent 
                    condition and ready for its new owner. The powerful {vehicle.engine_capacity} engine delivers 
                    an exhilarating driving experience, while the {vehicle.transmission} transmission ensures 
                    smooth and effortless gear changes.
                  </p>
                  <p className="text-gray-600 mt-3">
                    Located in {vehicle.location}, this vehicle is available for viewing by appointment. 
                    Contact us today to arrange a test drive and experience this exceptional {vehicle.title} for yourself.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === "features" && (
              <div>
                {Object.entries(featuresByCategory).map(([category, features]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 capitalize">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {features.filter(f => f.value).map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Contact/Price Box */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">{vehicle.title}</h2>
                {vehicle.featured && (
                  <Badge className="bg-amber-500 mt-2">Featured</Badge>
                )}
              </div>
              
              <div className="text-3xl font-bold text-primary mb-6">
                ${vehicle.price.toLocaleString()}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{vehicle.year}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage</span>
                  <span className="font-medium">{vehicle.mileage}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-medium">{vehicle.fuel_type}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission</span>
                  <span className="font-medium">{vehicle.transmission}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Seller
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Contact about {vehicle.title}</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Email</label>
                        <input 
                          type="email" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Phone</label>
                        <input 
                          type="tel" 
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea 
                          className="w-full p-2 border rounded-md h-32"
                          placeholder="I'm interested in this vehicle. Please contact me with more information."
                        ></textarea>
                      </div>
                      <Button className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Seller
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Test Drive
                </Button>
                
                <Button variant="ghost" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Vehicle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VehicleDetail;
