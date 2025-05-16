
import { useCallback } from 'react';

export function useImageValidation() {
  // Validate and filter images to ensure they are valid URLs
  const validateImages = useCallback((images: string[]): string[] => {
    if (!images || !Array.isArray(images)) {
      console.warn("Invalid images array provided to validator");
      return [];
    }
    
    // Filter out any empty or invalid image URLs
    const validImages = images.filter(url => url && url.trim() !== "");
    
    if (validImages.length !== images.length) {
      console.warn(`Filtered out ${images.length - validImages.length} invalid images`);
    }
    
    return validImages;
  }, []);
  
  // Check if at least one valid image is available
  const hasValidImages = useCallback((images: string[]): boolean => {
    return validateImages(images).length > 0;
  }, [validateImages]);
  
  return {
    validateImages,
    hasValidImages
  };
}
