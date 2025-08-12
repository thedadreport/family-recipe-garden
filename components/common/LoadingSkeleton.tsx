// components/common/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  type: 'recipe' | 'meal-plan' | 'ingredient-list' | 'card' | 'form' | 'collection';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type, 
  count = 1, 
  className = '' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'recipe':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
            {/* Recipe Header */}
            <div className="h-8 bg-gray-200 rounded-lg mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded mb-6 w-1/2"></div>
            
            {/* Recipe Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Ingredients Column */}
              <div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="space-y-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
              
              {/* Instructions Column */}
              <div>
                <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Tips Section */}
            <div className="mt-12 p-6 bg-gray-50 rounded-xl">
              <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        );
        
      case 'meal-plan':
        return (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-10 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        );
        
      case 'card':
        return (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full ml-4"></div>
            </div>
            <div className="flex items-center space-x-4 text-sm mb-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl"></div>
          </div>
        );
        
      case 'form':
        return (
          <div className="space-y-6 animate-pulse">
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-100 rounded-xl"></div>
                <div className="h-12 bg-gray-100 rounded-xl"></div>
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded-full w-20"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'collection':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded mb-2 w-4/5"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-xl"></div>
              </div>
            ))}
          </div>
        );
        
      case 'ingredient-list':
        return (
          <div className="space-y-3 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        );
    }
  };

  return (
    <div className={className}>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};