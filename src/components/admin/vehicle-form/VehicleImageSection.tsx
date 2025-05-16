
import React, { useEffect } from 'react';
import MultipleImageUploader from '@/components/admin/MultipleImageUploader';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    
    // Only show toast notifications when appropriate
    if (validImages.length === 0 && newImages.length > 0) {
      toast({
        title: "Image Required",
        description: "Please upload at least one image for the vehicle",
        variant: "destructive"
      });
    } else if (validImages.length > 0) {
      toast({
        title: "Images Updated",
        description: `${validImages.length} image(s) added to the vehicle`
      });
    }
  };

  const hasImages = images && images.length > 0;

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
      <p className="text-sm text-muted-foreground">
        Upload up to 5 images of the vehicle. The first image will be used as the main image.
      </p>
      
      {/* Show current state for debugging */}
      <div className="text-xs text-gray-500 mt-1">
        {hasImages ? 
          `${images.length} image(s) uploaded` : 
          "No images uploaded yet"
        }
      </div>

      {/* Only show error if there are no valid images */}
      {!hasImages && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>
            At least one image is required
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VehicleImageSection;
