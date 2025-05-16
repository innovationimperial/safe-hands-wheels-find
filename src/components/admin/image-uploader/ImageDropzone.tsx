
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';

interface ImageDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isUploading: boolean;
  disabled: boolean;
  uploadedCount: number;
  maxImages: number;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onDrop,
  isUploading,
  disabled,
  uploadedCount,
  maxImages
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    disabled: isUploading || disabled
  });
  
  if (uploadedCount >= maxImages) return null;

  return (
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
              {uploadedCount} of {maxImages} images uploaded
            </p>
            {uploadedCount > 0 && (
              <p className="text-xs text-amber-600 font-medium">
                The first uploaded image will be used as the main vehicle image
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageDropzone;
