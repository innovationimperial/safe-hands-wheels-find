
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
}

const VehicleImageGallery = ({ images, title }: VehicleImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Filter out any empty or invalid image URLs
  const validImages = images.filter(img => img && img.trim() !== "");
  
  // If no valid images are available, display a placeholder
  if (validImages.length === 0) {
    return (
      <div className="mb-6">
        <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden flex items-center justify-center">
          <p className="text-gray-500">No images available for this vehicle</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Main carousel with large images */}
      <Carousel 
        className="w-full" 
        onSelect={(index) => {
          setCurrentImageIndex(index);
        }}
      >
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error(`Failed to load image: ${image}`);
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      {/* Thumbnail navigation (only show if more than one image) */}
      {validImages.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {validImages.map((image, index) => (
            <div 
              key={index}
              onClick={() => setCurrentImageIndex(index)} 
              className={cn(
                "cursor-pointer rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                currentImageIndex === index 
                  ? "border-primary opacity-100" 
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              style={{ width: '80px', height: '60px' }}
            >
              <img 
                src={image} 
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
