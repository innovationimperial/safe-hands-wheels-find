
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { uploadVehicleImage } from '@/integrations/supabase/client';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  userId: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, userId }) => {
  const [isUploading, setIsUploading] = useState(false);
  
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
    
    // Only process the first file if multiple are dropped
    const file = acceptedFiles[0];
    
    setIsUploading(true);
    try {
      const imageUrl = await uploadVehicleImage(file, userId);
      
      if (imageUrl) {
        onImageUploaded(imageUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully."
        });
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
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
  }, [userId, onImageUploaded]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxFiles: 1,
    disabled: isUploading
  });
  
  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer ${
        isDragActive 
          ? 'border-primary bg-primary/10' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        {isUploading ? (
          <>
            <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
            <p className="text-sm text-gray-500">Uploading image...</p>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-gray-400" />
            <p className="font-medium">Drag & drop an image here, or click to select</p>
            <p className="text-sm text-gray-500">
              Supports: JPEG, PNG, WebP (Max 5MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
