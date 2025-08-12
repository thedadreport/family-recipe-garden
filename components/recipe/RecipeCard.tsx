import React from 'react';
import { Clock, Users, Star } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
  showActions?: boolean;
}

export function RecipeCard({ 
  recipe, 
  onViewRecipe, 
  onToggleFavorite, 
  showActions = true 
}: RecipeCardProps) {
  const handleViewClick = () => {
    onViewRecipe(recipe);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onViewRecipe
    onToggleFavorite(recipe.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      <div className="p-6">
        {/* Header with title and favorite button */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight flex-1 mr-3">
            {recipe.title}
          </h3>
          {showActions && (
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                recipe.isFavorite 
                  ? 'text-yellow-500' 
                  : 'text-gray-300 hover:text-yellow-500'
              }`}
              aria-label={recipe.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star className={`h-5 w-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
        
        {/* Recipe meta information */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.totalTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Serves {recipe.servings}</span>
          </div>
        </div>

        {/* Cooking method and cuisine tags */}
        {(recipe.cookingMethod || recipe.cuisine || recipe.situation) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.cookingMethod && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {recipe.cookingMethod}
              </span>
            )}
            {recipe.cuisine && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {recipe.cuisine}
              </span>
            )}
            {recipe.situation && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {recipe.situation}
              </span>
            )}
          </div>
        )}

        {/* Recipe preview - first few ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Key ingredients:</div>
            <div className="text-sm text-gray-800">
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && '...'}
            </div>
          </div>
        )}

        {/* Chef's note preview */}
        {recipe.notes && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 italic line-clamp-2">
              {recipe.notes.length > 100 
                ? `${recipe.notes.substring(0, 100)}...` 
                : recipe.notes
              }
            </p>
          </div>
        )}
        
        {/* View Recipe Button */}
        <button
          onClick={handleViewClick}
          className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}