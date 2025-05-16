
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ImageIcon } from 'lucide-react';

interface ImagePreviewGridProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  imagePreviewErrors: Record<number, boolean>;
  onImageError?: (index: number) => void;
}

const ImagePreviewGrid: React.FC<ImagePreviewGridProps> = ({ 
  images, 
  onRemoveImage, 
  imagePreviewErrors,
  onImageError = () => {} 
}) => {
  if (images.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {images.map((imgUrl, index) => (
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
              onError={() => onImageError(index)}
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemoveImage(index)}
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
  );
};

export default ImagePreviewGrid;
