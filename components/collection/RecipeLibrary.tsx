import React, { useState } from 'react';
import { BookOpen, Calendar } from 'lucide-react';
import { Recipe } from '../../types/recipe';
import { MealPlan } from '../../types/mealPlan';
import { SavedRecipes } from './SavedRecipes';
import { SavedPlans } from './SavedPlans';
import { Button } from '../common/Button';

interface RecipeLibraryProps {
  savedRecipes: Recipe[];
  savedPlans: MealPlan[];
  onViewRecipe: (recipe: Recipe) => void;
  onViewPlan: (plan: MealPlan) => void;
  onToggleFavoriteRecipe: (recipeId: number) => void;
  onCreateNewRecipe: () => void;
  onCreateNewPlan: () => void;
}

type LibraryView = 'recipes' | 'plans';

export const RecipeLibrary: React.FC<RecipeLibraryProps> = ({
  savedRecipes,
  savedPlans,
  onViewRecipe,
  onViewPlan,
  onToggleFavoriteRecipe,
  onCreateNewRecipe,
  onCreateNewPlan
}) => {
  const [activeView, setActiveView] = useState<LibraryView>('recipes');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Your Recipe Collection</h1>
            <div className="flex items-center space-x-4">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setActiveView('recipes')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    activeView === 'recipes' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Recipes ({savedRecipes.length})
                </button>
                <button
                  onClick={() => setActiveView('plans')}
                  className={`px-4 py-2 text-sm font-medium flex items-center ${
                    activeView === 'plans' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Meal Plans ({savedPlans.length})
                </button>
              </div>
              <Button
                onClick={activeView === 'recipes' ? onCreateNewRecipe : onCreateNewPlan}
                variant="primary"
                icon={activeView === 'recipes' ? <span className="text-lg">✨</span> : <Calendar className="h-5 w-5" />}
              >
                {activeView === 'recipes' ? 'New Recipe' : 'New Plan'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        {activeView === 'recipes' ? (
          <SavedRecipes
            savedRecipes={savedRecipes}
            onViewRecipe={onViewRecipe}
            onToggleFavorite={onToggleFavoriteRecipe}
            onCreateNewRecipe={onCreateNewRecipe}
          />
        ) : (
          <SavedPlans
            savedPlans={savedPlans}
            onViewPlan={onViewPlan}
            onCreateNewPlan={onCreateNewPlan}
          />
        )}
      </div>
    </div>
  );
};