
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
}

const VehicleImageGallery = ({ images, title }: VehicleImageGalleryProps) => {
  return (
    <div className="mb-6">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="bg-gray-100 h-[400px] rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={`${title} - Image ${index + 1}`}
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
  );
};

export default VehicleImageGallery;
