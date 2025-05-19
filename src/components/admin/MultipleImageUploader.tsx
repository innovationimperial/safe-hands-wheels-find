
import React, { useState, useCallback, useEffect } from 'react';
import { uploadVehicleImage } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ImageDropzone from '@/components/admin/image-uploader/ImageDropzone';
import ImagePreviewGrid from '@/components/admin/image-uploader/ImagePreviewGrid';
import UploadProgressBar from '@/components/admin/image-uploader/UploadProgressBar';
import UploadError from '@/components/admin/image-uploader/UploadError';

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imagePreviewErrors, setImagePreviewErrors] = useState<Record<number, boolean>>({});
  
  // Initialize uploadedImages from existingImages when component mounts
  // or when existingImages changes
  useEffect(() => {
    console.log("MultipleImageUploader: Received existing images:", existingImages);
    if (existingImages && existingImages.length > 0) {
      const validImages = existingImages.filter(url => url && url.trim() !== "");
      console.log("MultipleImageUploader: Setting valid existing images:", validImages);
      setUploadedImages(validImages);
      
      // Also notify parent immediately to ensure state is synchronized
      onImagesUploaded(validImages);
    }
  }, [existingImages]);
  
  // Add this effect to notify parent whenever our local state changes
  useEffect(() => {
    console.log("MultipleImageUploader: Local state changed, notifying parent:", uploadedImages);
    onImagesUploaded(uploadedImages);
  }, [uploadedImages, onImagesUploaded]);
  
  const handleImageError = (index: number) => {
    setImagePreviewErrors(prev => ({ ...prev, [index]: true }));
  };
  
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
    
    // Reset any previous errors
    setUploadError(null);
    setUploadProgress(0);
    
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
      // Process each file sequentially instead of in parallel
      const successfulUploads: string[] = [];
      const failedUploads: string[] = [];
      
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        try {
          console.log(`Processing file ${i + 1}/${acceptedFiles.length}: ${file.name}`);
          
          // Update progress
          const progressPerFile = 100 / acceptedFiles.length;
          const currentProgress = Math.round(progressPerFile * i);
          setUploadProgress(currentProgress);
          
          const imageUrl = await uploadVehicleImage(file, userId);
          
          if (imageUrl) {
            successfulUploads.push(imageUrl);
            console.log(`Successfully uploaded: ${file.name}`);
          } else {
            failedUploads.push(file.name);
            console.error(`Failed to upload: ${file.name}`);
          }
        } catch (fileError) {
          console.error(`Error uploading ${file.name}:`, fileError);
          failedUploads.push(file.name);
        }
      }
      
      // Set to 100% when all files are processed
      setUploadProgress(100);
      
      if (successfulUploads.length > 0) {
        // Create a new array with all images
        const newImages = [...uploadedImages, ...successfulUploads];
        
        // Update local state
        setUploadedImages(newImages);
        
        // Notify parent component about image updates
        onImagesUploaded(newImages);
        
        toast({
          title: "Images uploaded",
          description: `Successfully uploaded ${successfulUploads.length} image(s).`
        });
      } 
      
      if (failedUploads.length > 0) {
        setUploadError(`Failed to upload ${failedUploads.length} image(s).`);
        toast({
          title: "Some uploads failed",
          description: `Failed to upload ${failedUploads.length} image(s). Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in onDrop:', error);
      setUploadError('Failed to upload images. Please try again.');
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset progress after a small delay so the user can see it reached 100%
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  }, [userId, onImagesUploaded, uploadedImages, maxImages]);
  
  const removeImage = (indexToRemove: number) => {
    // Create a new array without the removed image
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    
    // Update local state
    setUploadedImages(newImages);
    
    // Also notify parent component when images are removed
    onImagesUploaded(newImages);
    
    // Also remove from error tracking if exists
    if (imagePreviewErrors[indexToRemove]) {
      const newErrors = { ...imagePreviewErrors };
      delete newErrors[indexToRemove];
      setImagePreviewErrors(newErrors);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Image preview grid */}
      <ImagePreviewGrid 
        images={uploadedImages} 
        onRemoveImage={removeImage} 
        imagePreviewErrors={imagePreviewErrors} 
        onImageError={handleImageError}
      />
      
      {/* Upload progress */}
      <UploadProgressBar 
        isUploading={isUploading} 
        progress={uploadProgress} 
      />
      
      {/* Error message */}
      <UploadError error={uploadError} />
      
      {/* Dropzone area */}
      <ImageDropzone 
        onDrop={onDrop}
        isUploading={isUploading}
        disabled={uploadedImages.length >= maxImages}
        uploadedCount={uploadedImages.length}
        maxImages={maxImages}
      />
    </div>
  );
};

export default MultipleImageUploader;
