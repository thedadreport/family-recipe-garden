import React from 'react';
import { Clock, Users, Utensils, Heart, Star } from 'lucide-react';
import { Recipe } from '../../types/recipe';
import { COOKING_METHODS } from '../../utils/constants';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSaveRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
}

export function RecipeDisplay({ recipe, onSaveRecipe, onToggleFavorite }: RecipeDisplayProps) {
  const getCookingMethodLabel = (methodValue?: string) => {
    if (!methodValue) return null;
    const method = COOKING_METHODS.find(m => m.value === methodValue);
    return method?.label;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
            <h1 className="text-3xl font-semibold mb-3 tracking-tight">{recipe.title}</h1>
            <div className="flex items-center space-x-6 text-white/90 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{recipe.totalTime}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Serves {recipe.servings}</span>
              </div>
              {recipe.cookingMethod && (
                <div className="flex items-center space-x-2">
                  <Utensils className="h-4 w-4" />
                  <span>{getCookingMethodLabel(recipe.cookingMethod)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex space-x-3 mb-8">
              <button
                onClick={() => onSaveRecipe(recipe)}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
              >
                Save Recipe
              </button>
              <button
                onClick={() => onToggleFavorite(recipe.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center space-x-2 border ${
                  recipe.isFavorite
                    ? 'bg-yellow-400 text-white border-yellow-400'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                <Star className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                <span>Favorite</span>
              </button>
            </div>

            {/* Recipe Content */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  Ingredients
                </h2>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-900 leading-relaxed">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  Instructions
                </h2>
                <div className="space-y-6">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-900 leading-relaxed pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tips Section */}
            {recipe.tips && recipe.tips.length > 0 && (
              <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-3" />
                  Kitchen Tips
                </h3>
                <div className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <p key={index} className="text-gray-800 leading-relaxed">• {tip}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Chef's Notes */}
            {recipe.notes && (
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Chef's Notes</h3>
                <p className="text-gray-800 leading-relaxed">{recipe.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}