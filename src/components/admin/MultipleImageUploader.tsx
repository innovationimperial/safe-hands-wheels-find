
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { uploadVehicleImage } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

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
    }
  }, [existingImages]);
  
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
        const newImages = [...uploadedImages, ...successfulUploads];
        setUploadedImages(newImages);
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
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
    
    // Also remove from error tracking if exists
    if (imagePreviewErrors[indexToRemove]) {
      const newErrors = { ...imagePreviewErrors };
      delete newErrors[indexToRemove];
      setImagePreviewErrors(newErrors);
    }
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
              className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group bg-gray-50"
            >
              {imagePreviewErrors[index] ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Image preview unavailable</p>
                </div>
              ) : (
                <img 
                  src={imgUrl} 
                  alt={`Vehicle image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 text-center">
                  Main Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Upload progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {/* Error message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p className="font-medium">{uploadError}</p>
          <p className="text-sm mt-1">Please check your connection and try again.</p>
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
                {uploadedImages.length > 0 && (
                  <p className="text-xs text-amber-600 font-medium">
                    The first uploaded image will be used as the main vehicle image
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleImageUploader;
