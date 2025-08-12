import React, { useState } from 'react';
import { BookOpen, Star, Clock, Users, ArrowLeft } from 'lucide-react';
import { Recipe } from '../../types/recipe';
import { Button } from '../common/Button';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

interface SavedRecipesProps {
  savedRecipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
  onCreateNewRecipe: () => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({
  savedRecipes,
  onViewRecipe,
  onToggleFavorite,
  onCreateNewRecipe
}) => {
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [loading, setLoading] = useState<boolean>(false);

  // Filter recipes based on selected filter
  const filteredRecipes = filter === 'favorites' 
    ? savedRecipes.filter(recipe => recipe.isFavorite)
    : savedRecipes;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">Recipe Collection</h1>
            <p className="text-gray-600 text-lg">Your saved family recipes</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Recipes
              </button>
              <button
                onClick={() => setFilter('favorites')}
                className={`px-4 py-2 text-sm font-medium flex items-center ${
                  filter === 'favorites' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Star className="h-4 w-4 mr-1" />
                Favorites
              </button>
            </div>
            <Button
              onClick={onCreateNewRecipe}
              variant="primary"
              icon={<span className="text-lg">✨</span>}
            >
              Create New Recipe
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md mx-auto">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                {filter === 'favorites' ? 'No favorite recipes yet' : 'No recipes yet'}
              </h2>
              <p className="text-gray-600">
                {filter === 'favorites' 
                  ? 'Mark recipes as favorites to see them here'
                  : 'Create your first recipe to start building your collection'}
              </p>
              {filter === 'favorites' && savedRecipes.length > 0 && (
                <Button
                  onClick={() => setFilter('all')}
                  variant="secondary"
                  className="mt-4"
                >
                  View All Recipes
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 leading-tight">{recipe.title}</h3>
                    <button
                      onClick={() => onToggleFavorite(recipe.id)}
                      className={`p-2 rounded-full transition-colors ${
                        recipe.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                      }`}
                    >
                      <Star className={`h-5 w-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{recipe.totalTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onViewRecipe(recipe)}
                    variant="secondary"
                    fullWidth
                  >
                    View Recipe
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};