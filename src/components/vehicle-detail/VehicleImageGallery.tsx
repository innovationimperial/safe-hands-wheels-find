
import React, { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Image, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
}

const VehicleImageGallery = ({ images, title }: VehicleImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  // Filter out any empty or invalid image URLs
  const validImages = images.filter(img => img && img.trim() !== "");
  
  // Log image list for debugging
  useEffect(() => {
    console.log(`VehicleImageGallery: Received ${images.length} images, ${validImages.length} are valid:`, validImages);
    if (validImages.length === 0) {
      console.warn('No valid images found for vehicle');
    }
    // Set loading to false after a short delay
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [images, validImages.length]);
  
  const handleImageError = useCallback((image: string, index: number) => {
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
  }, [imageErrors]);
  
  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [validImages.length]);
  
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prev => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  }, [validImages.length]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevImage();
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "Escape" && showFullscreen) {
        setShowFullscreen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevImage, handleNextImage, showFullscreen]);
  
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
  
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden flex flex-col items-center justify-center">
          <div className="h-16 w-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-4 relative">
      {/* Main carousel with large images */}
      <div className="relative">
        <Carousel 
          className="w-full" 
          opts={{
            startIndex: currentImageIndex,
            loop: validImages.length > 1,
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
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowFullscreen(true)}
                      onError={() => handleImageError(image, index)}
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
        
        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnail navigation (only show if more than one image) */}
      {validImages.length > 1 && (
        <div className="flex overflow-x-auto gap-2 py-2 pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <div 
              key={`thumb-${index}-${image}`}
              onClick={() => setCurrentImageIndex(index)} 
              className={cn(
                "cursor-pointer rounded-md overflow-hidden flex-shrink-0 border-2 transition-all",
                currentImageIndex === index 
                  ? "border-primary opacity-100 ring-2 ring-primary ring-offset-2" 
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
      
      {/* Fullscreen modal */}
      {showFullscreen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setShowFullscreen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="relative w-full max-w-4xl max-h-[80vh]">
            {!imageErrors[currentImageIndex] ? (
              <img 
                src={validImages[currentImageIndex]} 
                alt={`${title} - Fullscreen`}
                className="w-full h-full object-contain"
                onError={() => handleImageError(validImages[currentImageIndex], currentImageIndex)}
              />
            ) : (
              <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-gray-800">
                <Image className="h-20 w-20 text-gray-400 mb-4" />
                <p className="text-gray-300">Image failed to load</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center mt-4 gap-4">
            <button 
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <span className="text-white">
              {currentImageIndex + 1} / {validImages.length}
            </span>
            <button 
              className="bg-white/10 hover:bg-white/20 p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
          
          {validImages.length > 3 && (
            <div className="w-full max-w-md mt-4 px-12">
              <Slider
                value={[currentImageIndex]}
                min={0}
                max={validImages.length - 1}
                step={1}
                onValueChange={(value) => setCurrentImageIndex(value[0])}
                className="py-4"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleImageGallery;
