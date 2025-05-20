
import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
}

const VehicleImageGallery = ({ images, title }: VehicleImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [initialized, setInitialized] = useState(false);
  
  // Filter out any empty or invalid image URLs
  const validImages = images.filter(img => img && img.trim() !== "");
  
  // Log image list for debugging
  useEffect(() => {
    console.log(`VehicleImageGallery: Received ${images.length} images, ${validImages.length} are valid:`, validImages);
    if (validImages.length === 0) {
      console.warn('No valid images found for vehicle');
    } else {
      // Initialize carousel when images are available
      setInitialized(true);
    }
  }, [images, validImages.length]);
  
  const handleImageError = (image: string, index: number) => {
    console.error(`Failed to load image at index ${index}: ${image}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    
    // Only show toast for the first error to avoid spamming
    if (Object.keys(imageErrors).length === 0) {
      toast({
        title: "Image Error",
        description: "Failed to load one or more vehicle images",
        variant: "destructive"
      });
    }
  };
  
  // If no valid images are available, display a placeholder
  if (validImages.length === 0) {
    return (
      <div className="mb-6">
        <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden flex flex-col items-center justify-center">
          <Image className="h-20 w-20 text-gray-300 mb-4" />
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
        opts={{
          startIndex: currentImageIndex,
          loop: validImages.length > 1,
          // Remove the draggable property as it's not in the OptionsType
          // and the carousel is draggable by default
          watchDrag: true,
        }}
        onSelect={(index) => {
          if (typeof index === 'number') {
            setCurrentImageIndex(index);
            console.log(`Selected image index: ${index}`);
          }
        }}
      >
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={`main-${index}-${image}`}>
              <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-lg overflow-hidden">
                {imageErrors[index] ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                    <Image className="h-16 w-16 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Image failed to load</p>
                  </div>
                ) : (
                  <img 
                    src={image} 
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      handleImageError(image, index);
                    }}
                  />
                )}
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        {validImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {/* Thumbnail navigation (only show if more than one image) */}
      {validImages.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {validImages.map((image, index) => (
            <div 
              key={`thumb-${index}-${image}`}
              onClick={() => setCurrentImageIndex(index)} 
              className={cn(
                "cursor-pointer rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                currentImageIndex === index 
                  ? "border-primary opacity-100" 
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
              style={{ width: '80px', height: '60px' }}
            >
              {imageErrors[index] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Image className="h-4 w-4 text-gray-300" />
                </div>
              ) : (
                <img 
                  src={image} 
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(image, index)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
