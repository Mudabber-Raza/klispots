import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV === 'production') {
      // Import web-vitals dynamically to avoid bundle bloat in development
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;




