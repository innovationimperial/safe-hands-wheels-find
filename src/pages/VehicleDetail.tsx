
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import useVehicleDetail from "@/hooks/use-vehicle-detail";
import VehicleImageGallery from "@/components/vehicle-detail/VehicleImageGallery";
import VehicleDetailTabs from "@/components/vehicle-detail/VehicleDetailTabs";
import VehicleSidebar from "@/components/vehicle-detail/VehicleSidebar";
import VehicleDetailLoading from "@/components/vehicle-detail/VehicleDetailLoading";
import VehicleDetailError from "@/components/vehicle-detail/VehicleDetailError";
import { toast } from "@/hooks/use-toast";

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle, allImages, featuresByCategory, isLoading, error } = useVehicleDetail(id);
  
  // Enhanced debugging to help identify image issues
  useEffect(() => {
    if (vehicle && allImages) {
      console.log('Vehicle details loaded:', {
        id: vehicle.id,
        title: vehicle.title,
        primaryImage: vehicle.image,
        additionalImages: allImages,
        totalImages: allImages.length
      });
      
      // Show appropriate messages based on image count
      if (allImages.length === 0) {
        toast({
          title: "Warning",
          description: "No images are available for this vehicle",
          variant: "destructive"
        });
      } else if (allImages.length === 1) {
        console.log("Only one image is available for this vehicle");
      } else {
        console.log(`${allImages.length} images available for carousel`);
      }
    }
  }, [vehicle, allImages]);
  
  // Loading state
  if (isLoading) {
    return <VehicleDetailLoading />;
  }
  
  // Error state
  if (error || !vehicle) {
    return <VehicleDetailError />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/buy-car" className="flex items-center text-sm text-gray-500 hover:text-gray-700 group">
          <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
          <span>Back to listings</span>
        </Link>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{vehicle.title}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vehicle Images and Details */}
        <div className="col-span-1 lg:col-span-2">
          <VehicleImageGallery images={allImages} title={vehicle.title} />
          <VehicleDetailTabs vehicle={vehicle} featuresByCategory={featuresByCategory} />
        </div>
        
        {/* Contact/Price Sidebar */}
        <div className="col-span-1">
          <VehicleSidebar vehicle={vehicle} />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
