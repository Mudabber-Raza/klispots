// Image optimization utilities for better SEO and performance

export const optimizeImageUrl = (url: string, width: number = 800, quality: number = 80): string => {
  // If it's already an optimized URL, return as is
  if (url.includes('w=') || url.includes('quality=')) {
    return url;
  }
  
  // For Unsplash images, add optimization parameters
  if (url.includes('unsplash.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=${quality}&fit=crop&crop=center`;
  }
  
  // For local images, return as is (they should be pre-optimized)
  if (url.startsWith('/lovable-uploads/') || url.startsWith('/public/')) {
    return url;
  }
  
  // For S3 images, return as is (they should be pre-optimized)
  if (url.includes('s3.eu-north-1.amazonaws.com')) {
    return url;
  }
  
  return url;
};

export const getImageDimensions = (url: string): { width: number; height: number } => {
  // Default dimensions for different image types
  if (url.includes('hero') || url.includes('banner')) {
    return { width: 1200, height: 600 };
  }
  
  if (url.includes('card') || url.includes('thumbnail')) {
    return { width: 400, height: 300 };
  }
  
  if (url.includes('avatar') || url.includes('profile')) {
    return { width: 150, height: 150 };
  }
  
  // Default dimensions
  return { width: 800, height: 600 };
};

export const generateImageAlt = (venueName: string, category: string, city: string): string => {
  return `${venueName} - ${category} in ${city}, Pakistan. High-quality image showing the venue's atmosphere and design.`;
};

export const getImagePriority = (url: string, isAboveFold: boolean = false): 'high' | 'low' => {
  // Hero images and above-the-fold images should be high priority
  if (isAboveFold || url.includes('hero') || url.includes('banner')) {
    return 'high';
  }
  
  // Card images and below-the-fold images can be low priority
  return 'low';
};

// WebP support detection
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Lazy loading utility
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

