
import { useState, useCallback } from 'react';

export function useImageValidation() {
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Validate a single image URL 
  const isValidImageUrl = useCallback((url: string): boolean => {
    return !!url && url.trim() !== "";
  }, []);
  
  // Filter and validate image URLs
  const validateImages = useCallback((images: string[]): string[] => {
    if (!images) return [];
    
    const validImages = images.filter(isValidImageUrl);
    
    if (validImages.length === 0) {
      setValidationError("No valid images found");
    } else {
      setValidationError(null);
    }
    
    return validImages;
  }, [isValidImageUrl]);
  
  // Check if there are any valid images
  const hasValidImages = useCallback((images: string[]): boolean => {
    if (!images) return false;
    return images.filter(isValidImageUrl).length > 0;
  }, [isValidImageUrl]);
  
  return {
    validationError,
    validateImages,
    isValidImageUrl,
    hasValidImages
  };
}
