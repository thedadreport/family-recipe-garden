import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { RecipeLibrary } from './components/collection/RecipeLibrary';
import { Recipe } from './types/recipe';
import { MealPlan } from './types/mealPlan';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Import your Recipe and Meal Plan main components
// These would be the container components that hold the recipe generator and weekly planner
// import { RecipeGenerator } from './components/recipe/RecipeGenerator';
// import { WeeklyPlanner } from './components/meal-planning/WeeklyPlanner';

export type AppRoute = 'landing' | 'recipe' | 'weeklyPlan' | 'collection';

export const App: React.FC = () => {
  // State to manage the current route/view
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  
  // State to manage the user's saved recipes and meal plans
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  
  // State to track currently viewed recipe or plan
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  
  // Navigation functions
  const navigateToRoute = (route: AppRoute) => {
    setCurrentRoute(route);
  };
  
  // Recipe management functions
  const saveRecipe = (recipe: Recipe) => {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };
  
  const toggleFavoriteRecipe = (recipeId: number) => {
    setSavedRecipes(savedRecipes.map(recipe => 
      recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
    
    if (currentRecipe && currentRecipe.id === recipeId) {
      setCurrentRecipe({ ...currentRecipe, isFavorite: !currentRecipe.isFavorite });
    }
  };
  
  // Plan management functions
  const savePlan = (plan: MealPlan) => {
    if (!savedPlans.find(p => p.id === plan.id)) {
      setSavedPlans([...savedPlans, plan]);
    }
  };
  
  // View management functions
  const viewRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    // You might want to navigate to a recipe detail view here
    // setCurrentRoute('recipeDetail');
  };
  
  const viewPlan = (plan: MealPlan) => {
    setCurrentPlan(plan);
    // You might want to navigate to a plan detail view here
    // setCurrentRoute('planDetail');
  };
  
  // Main render function - renders the appropriate view based on current route
  return (
    <ErrorBoundary>
      {currentRoute === 'landing' && (
        <LandingPage 
          onNavigateToTool={(tool: string) => {
            if (tool === '/recipe') {
              navigateToRoute('recipe');
            } else if (tool === '/weekly-plan') {
              navigateToRoute('weeklyPlan');
            } else if (tool === '/collection') {
              navigateToRoute('collection');
            }
          }}
        />
      )}
      
      {currentRoute === 'collection' && (
        <RecipeLibrary
          savedRecipes={savedRecipes}
          savedPlans={savedPlans}
          onViewRecipe={viewRecipe}
          onViewPlan={viewPlan}
          onToggleFavoriteRecipe={toggleFavoriteRecipe}
          onCreateNewRecipe={() => navigateToRoute('recipe')}
          onCreateNewPlan={() => navigateToRoute('weeklyPlan')}
        />
      )}
      
      {/* 
        Uncomment these sections when you have these components ready:
        
        {currentRoute === 'recipe' && (
          <RecipeGenerator
            onSaveRecipe={saveRecipe}
            onNavigateToCollection={() => navigateToRoute('collection')}
            currentRecipe={currentRecipe}
            setCurrentRecipe={setCurrentRecipe}
          />
        )}
        
        {currentRoute === 'weeklyPlan' && (
          <WeeklyPlanner
            onSavePlan={savePlan}
            onNavigateToCollection={() => navigateToRoute('collection')}
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
          />
        )}
      */}
    </ErrorBoundary>
  );
};