import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Recipe, UserProfile } from '../../types/recipe';
import { DEFAULT_USER_PROFILE } from '../../utils/constants';
import SituationSelector from './SituationSelector';
import FamilyProfileForm from './FamilyProfileForm';
import { RecipePreferences } from './RecipePreferences';
import { RecipeDisplay } from './RecipeDisplay';
import { Button } from '../common/Button';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface RecipeGeneratorProps {
  onNavigateToCollection?: () => void;
  savedRecipesCount?: number;
}

type Step = 'onboarding' | 'recipe' | 'collection';

export function RecipeGenerator({ onNavigateToCollection, savedRecipesCount = 0 }: RecipeGeneratorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('onboarding');
  const [selectedSituation, setSelectedSituation] = useState<string>('general');
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const generateRecipe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build the prompt based on situation and profile
      const prompt = buildRecipePrompt(selectedSituation, userProfile);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text.trim();
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const recipe = JSON.parse(responseText);
      const processedRecipe: Recipe = {
        ...recipe,
        id: Date.now(),
        isFavorite: false,
        cookingMethod: userProfile.cookingMethod,
        seasonal: userProfile.seasonal,
        cuisine: userProfile.cuisine,
        mealType: userProfile.mealType,
        situation: selectedSituation
      };
      
      setCurrentRecipe(processedRecipe);
      setCurrentStep('recipe');
    } catch (error) {
      console.error("Recipe generation error:", error);
      setError("Failed to generate recipe. Please try again.");
      
      // Show fallback recipe
      setCurrentRecipe(createFallbackRecipe(selectedSituation, userProfile));
      setCurrentStep('recipe');
    }
    
    setLoading(false);
  };

  const buildRecipePrompt = (situation: string, profile: UserProfile): string => {
    const baseInfo = `Family: ${profile.adults} adults, ${profile.kids} kids
Time: ${profile.timeAvailable}
Skill: ${profile.cookingLevel}
Dietary: ${profile.dietaryPrefs.join(', ') || 'None'}
Ingredients: ${profile.ingredients || 'chef\'s choice'}`;

    const situationPrompts = {
      'general': `Create a family recipe. ${baseInfo}`,
      'protein-random': `I have protein + random ingredients. Help me make dinner. ${baseInfo}`,
      'stretch-protein': `Stretch small amount of protein for more people. ${baseInfo}`,
      'tomorrow-lunch': `Make dinner that also works as tomorrow's lunch. ${baseInfo}`,
      'one-pot': `One-pot meal for easy cleanup. ${baseInfo}`,
      'dump-bake': `Sheet pan meal - everything in oven. ${baseInfo}`
    };

    const prompt = situationPrompts[situation as keyof typeof situationPrompts] || situationPrompts.general;
    
    return `${prompt}

Please provide a JSON response:
{
  "title": "Recipe name",
  "totalTime": "cooking time", 
  "servings": "number of servings",
  "ingredients": ["ingredient with amounts"],
  "instructions": ["step by step instructions"],
  "tips": ["helpful cooking tips"],
  "notes": "Additional notes"
}

Your entire response must be valid JSON only.`;
  };

  const createFallbackRecipe = (situation: string, profile: UserProfile): Recipe => {
    const fallbacks = {
      'one-pot': {
        title: "One-Pot Chicken and Rice",
        notes: "Everything cooks in one pot for easy cleanup."
      },
      'dump-bake': {
        title: "Sheet Pan Chicken and Vegetables", 
        notes: "Simple sheet pan dinner with minimal cleanup."
      },
      'stretch-protein': {
        title: "Hearty Pasta with Small Amount of Meat",
        notes: "Stretches protein to feed everyone well."
      },
      'default': {
        title: "Garden Herb Pasta with Lemon",
        notes: "Works with any seasonal vegetables. Use the best ingredients you can find."
      }
    };

    const fallback = fallbacks[situation as keyof typeof fallbacks] || fallbacks.default;

    return {
      id: Date.now(),
      title: fallback.title,
      totalTime: "25 minutes",
      servings: `${profile.adults + profile.kids}`,
      ingredients: [
        "1 lb pasta",
        "1/4 cup olive oil", 
        "3 garlic cloves",
        "Seasonal vegetables",
        "Fresh herbs",
        "Cheese for serving"
      ],
      instructions: [
        "Boil salted water for pasta",
        "Cook pasta until al dente",
        "Sauté garlic in olive oil",
        "Add vegetables and cook until tender",
        "Toss with pasta and herbs",
        "Serve with cheese"
      ],
      tips: [
        "Taste and adjust seasoning",
        "Use pasta water for silky sauce",
        "Kids can help with simple tasks"
      ],
      notes: fallback.notes,
      isFavorite: false,
      cookingMethod: profile.cookingMethod,
      seasonal: profile.seasonal,
      cuisine: profile.cuisine,
      mealType: profile.mealType,
      situation: situation
    };
  };

  const saveRecipe = (recipe: Recipe) => {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes(prev => [...prev, recipe]);
    }
  };

  const toggleFavorite = (recipeId: number) => {
    setSavedRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
    
    if (currentRecipe && currentRecipe.id === recipeId) {
      setCurrentRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  const resetToOnboarding = () => {
    setCurrentStep('onboarding');
    setCurrentRecipe(null);
    setError(null);
  };

  if (currentStep === 'recipe' && currentRecipe) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
          {/* Navigation Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={resetToOnboarding}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                New Recipe
              </Button>
              
              {onNavigateToCollection && (
                <Button
                  variant="ghost"
                  onClick={onNavigateToCollection}
                  icon={<BookOpen className="h-4 w-4" />}
                >
                  Collection ({savedRecipesCount})
                </Button>
              )}
            </div>
          </div>

          <RecipeDisplay
            recipe={currentRecipe}
            onSaveRecipe={saveRecipe}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-lg w-full max-h-[95vh] overflow-y-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl mx-auto mb-5 flex items-center justify-center shadow-sm">
              <span className="text-2xl">🌿</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
              Family Recipe Garden
            </h1>
            <p className="text-gray-600 text-base">Create personalized recipes for your family</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <SituationSelector
              selectedSituation={selectedSituation}
              onSituationChange={setSelectedSituation}
            />

            <FamilyProfileForm
              profile={userProfile}
              onProfileChange={updateProfile}
            />

            <RecipePreferences
              profile={userProfile}
              onUpdateProfile={updateProfile}
            />

            <Button
              variant="primary"
              size="lg"
              onClick={generateRecipe}
              loading={loading}
              icon={<ArrowRight className="h-5 w-5" />}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating recipe...' : 'Generate Recipe'}
            </Button>
          </div>

          {loading && (
            <div className="mt-8">
              <LoadingSkeleton type="card" />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}