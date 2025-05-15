
import React, { useEffect } from 'react';
import MultipleImageUploader from '@/components/admin/MultipleImageUploader';
import { toast } from '@/hooks/use-toast';

interface VehicleImageSectionProps {
  userId: string;
  images: string[];
  updateImages: (images: string[]) => void;
}

const VehicleImageSection: React.FC<VehicleImageSectionProps> = ({ 
  userId, 
  images, 
  updateImages 
}) => {
  // Log received images for debugging
  useEffect(() => {
    console.log("VehicleImageSection: Received images:", images);
  }, [images]);

  const handleImageUpdate = (newImages: string[]) => {
    console.log("VehicleImageSection: Updating images:", newImages);
    // Validate images before updating
    const validImages = newImages.filter(url => url && url.trim() !== "");
    
    if (validImages.length !== newImages.length) {
      console.warn("Some invalid image URLs were filtered out");
    }
    
    updateImages(validImages);
    
    if (validImages.length === 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one image for the vehicle",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Vehicle Images <span className="text-red-500">*</span>
      </label>
      <MultipleImageUploader
        userId={userId}
        onImagesUploaded={handleImageUpdate}
        existingImages={images}
        maxImages={5}
      />
      {images.length === 0 && (
        <p className="text-sm text-red-500">
          At least one image is required
        </p>
      )}
    </div>
  );
};

export default VehicleImageSection;
