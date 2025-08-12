import React from 'react';
import { Plus, Clock, ChefHat } from 'lucide-react';
import { DayMeal } from '../../types/mealPlan';

interface MealCardProps {
  meal: DayMeal;
  mealIndex: number;
  onExpandMeal: (mealIndex: number) => void;
  isExpanding: boolean;
  isExpanded: boolean;
}

export function MealCard({ 
  meal, 
  mealIndex, 
  onExpandMeal, 
  isExpanding, 
  isExpanded 
}: MealCardProps) {
  const handleExpandClick = () => {
    if (!isExpanding && !isExpanded) {
      onExpandMeal(mealIndex);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {meal.day ? meal.day.slice(0, 1) : mealIndex + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{meal.title}</h3>
              <p className="text-sm text-blue-600">{meal.day}</p>
            </div>
          </div>
          
          {/* Expand Button */}
          {!isExpanded && (
            <button
              onClick={handleExpandClick}
              disabled={isExpanding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {isExpanding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Get Recipe</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-4">{meal.description}</p>
        
        {/* Time Information (when expanded) */}
        {isExpanded && meal.totalTime && (
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
            {meal.prepTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Prep: {meal.prepTime}</span>
              </div>
            )}
            {meal.cookTime && (
              <div className="flex items-center space-x-1">
                <ChefHat className="h-4 w-4" />
                <span>Cook: {meal.cookTime}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>Total: {meal.totalTime}</span>
            </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-300 pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Ingredients */}
              {meal.ingredients && meal.ingredients.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
                  <div className="space-y-2">
                    {meal.ingredients.map((ingredient, i) => (
                      <div key={i} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-800">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Instructions */}
              {meal.instructions && meal.instructions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                  <div className="space-y-3">
                    {meal.instructions.map((instruction, i) => (
                      <div key={i} className="flex space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tips and Prep Ahead */}
            {((meal.tips && meal.tips.length > 0) || (meal.prepAhead && meal.prepAhead.length > 0)) && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tips */}
                {meal.tips && meal.tips.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Tips</h4>
                    <div className="space-y-1">
                      {meal.tips.map((tip, i) => (
                        <p key={i} className="text-yellow-800 text-sm">• {tip}</p>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Prep Ahead */}
                {meal.prepAhead && meal.prepAhead.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Prep Ahead</h4>
                    <div className="space-y-1">
                      {meal.prepAhead.map((prep, i) => (
                        <p key={i} className="text-green-800 text-sm">• {prep}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}