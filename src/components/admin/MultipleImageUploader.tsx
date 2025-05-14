
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { uploadVehicleImage } from '@/integrations/supabase/client';

interface MultipleImageUploaderProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  userId: string;
  existingImages?: string[];
  maxImages?: number;
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({ 
  onImagesUploaded, 
  userId, 
  existingImages = [],
  maxImages = 5
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Initialize uploadedImages from existingImages when component mounts
  // or when existingImages changes
  useEffect(() => {
    console.log("MultipleImageUploader: Received existing images:", existingImages);
    if (existingImages && existingImages.length > 0) {
      const validImages = existingImages.filter(url => url && url.trim() !== "");
      console.log("MultipleImageUploader: Setting valid existing images:", validImages);
      setUploadedImages(validImages);
    }
  }, [existingImages]);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images.",
        variant: "destructive"
      });
      return;
    }
    
    if (acceptedFiles.length === 0) return;
    
    // Check if adding these files would exceed the max limit
    if (uploadedImages.length + acceptedFiles.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload a maximum of ${maxImages} images.`,
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = acceptedFiles.map(file => uploadVehicleImage(file, userId));
      const results = await Promise.all(uploadPromises);
      
      const successfulUploads = results.filter(Boolean) as string[];
      
      if (successfulUploads.length > 0) {
        const newImages = [...uploadedImages, ...successfulUploads];
        setUploadedImages(newImages);
        onImagesUploaded(newImages);
        
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${successfulUploads.length} image(s).`
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload images. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in onDrop:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [userId, onImagesUploaded, uploadedImages, maxImages]);
  
  const removeImage = (indexToRemove: number) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    disabled: isUploading || uploadedImages.length >= maxImages
  });
  
  return (
    <div className="space-y-4">
      {/* Image preview grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {uploadedImages.map((imgUrl, index) => (
            <div 
              key={`${imgUrl}-${index}`} 
              className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group"
            >
              <img 
                src={imgUrl} 
                alt={`Vehicle image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${imgUrl}`);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      {/* Dropzone area */}
      {uploadedImages.length < maxImages && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'bg-gray-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                <p className="text-sm text-gray-500">Uploading image(s)...</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="font-medium">Drag & drop images here, or click to select</p>
                <p className="text-sm text-gray-500">
                  Supports: JPEG, PNG, WebP (Max 5MB)
                </p>
                <p className="text-sm text-gray-500">
                  {uploadedImages.length} of {maxImages} images uploaded
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUploader;
