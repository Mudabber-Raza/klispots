import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const CafeCardSkeleton = () => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full bg-gray-200 rounded-t-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
      </div>

      <CardContent className="p-4 sm:p-6">
        {/* Title Skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Location Skeleton */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center mb-3">
          <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
          <div className="h-4 bg-gray-200 rounded w-12 mr-2"></div>
          <div className="w-2 h-2 bg-gray-200 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Features Skeleton */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="h-10 bg-gray-200 rounded w-full sm:w-24"></div>
          <div className="h-10 bg-gray-200 rounded w-full sm:w-20"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CafeCardSkeleton;




