import { useState, useCallback } from 'react';
import { useRecipeApiCall } from './useApiCall';
import { generateFallbackRecipe, getFallbackMessage } from '../utils/fallbacks';

// Recipe interface (matching existing component structure)
interface Recipe {
  id: number;
  title: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  notes: string;
  isFavorite: boolean;
  situation?: string;
  cookingMethod?: string;
  seasonal?: boolean;
  cuisine?: string;
  mealType?: string;
  createdAt?: Date;
}

// User profile interface (matching existing component structure)
interface UserProfile {
  adults: number;
  kids: number;
  dietaryPrefs: string[];
  timeAvailable: string;
  cookingLevel: string;
  ingredients: string;
  cookingMethod: string;
  seasonal: boolean;
  cuisine: string;
  mealType: string;
}

// Hook options
interface UseRecipeGeneratorOptions {
  onRecipeGenerated?: (recipe: Recipe) => void;
  onError?: (error: any) => void;
  useFallbacks?: boolean;
}

// Hook return type
interface UseRecipeGeneratorResult {
  currentRecipe: Recipe | null;
  loading: boolean;
  error: any;
  generateRecipe: (situation: string, profile: UserProfile) => Promise<Recipe | null>;
  regenerateRecipe: () => Promise<Recipe | null>;
  clearRecipe: () => void;
  saveRecipe: (recipe: Recipe) => void;
  savedRecipes: Recipe[];
  toggleFavorite: (recipeId: number) => void;
}

export function useRecipeGenerator(options: UseRecipeGeneratorOptions = {}): UseRecipeGeneratorResult {
  const { onRecipeGenerated, onError, useFallbacks = true } = options;
  
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [lastSituation, setLastSituation] = useState<string>('');
  const [lastProfile, setLastProfile] = useState<UserProfile | null>(null);

  const { 
    loading, 
    error, 
    execute: executeApiCall 
  } = useRecipeApiCall({
    onError: (apiError) => {
      if (onError) onError(apiError);
    }
  });

  // Build prompt based on situation and profile
  const buildRecipePrompt = useCallback((situation: string, profile: UserProfile): string => {
    const timeText = profile.timeAvailable === 'under30' ? 'Under 30 minutes' :
                    profile.timeAvailable === '30-60' ? '30-60 minutes' : '60+ minutes';
    
    const seasonalText = profile.seasonal ? 'use seasonal ingredients (August summer produce)' : 'use any available ingredients';
    const cuisineText = profile.cuisine || 'any cuisine style';
    const mealTypeText = profile.mealType || 'whole meal';
    const methodText = profile.cookingMethod || 'any method';
    
    let basePrompt = '';

    if (situation === 'protein-random') {
      basePrompt = `I need help creating a dinner recipe with what I have on hand.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Protein: ${profile.ingredients ? profile.ingredients.split(',')[0] : 'chicken'}
- Available ingredients: ${profile.ingredients || 'onions, garlic, potatoes'}

PREFERENCES
- Dietary restrictions: ${profile.dietaryPrefs.join(', ') || 'None'}
- Cuisine preference: ${cuisineText}
- Seasonal preference: ${seasonalText}

REQUIREMENTS
- Minimal steps (under 8 steps)
- Minimal cleanup
- Common ingredients only (nothing exotic)
- Family-friendly (kids will actually eat it)`;

    } else if (situation === 'stretch-protein') {
      basePrompt = `I need to stretch a small amount of protein to feed more people than planned.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Protein: ${profile.ingredients ? profile.ingredients.split(',')[0] + ' (small amount for ' + (profile.adults + profile.kids) + ' people)' : 'small amount of protein for ' + (profile.adults + profile.kids) + ' people'}
- Available ingredients to bulk up: ${profile.ingredients || 'pasta, rice, beans, vegetables'}

REQUIREMENTS
- Make the protein go further without it feeling skimpy
- Minimal steps (under 8 steps)
- Family-friendly (kids will actually eat it)
- Filling and satisfying despite less protein per person`;

    } else if (situation === 'tomorrow-lunch') {
      basePrompt = `I need to cook dinner tonight that will also provide good leftovers for tomorrow's lunch.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Main ingredients: ${profile.ingredients || 'chicken, vegetables, rice'}
- Cooking method: ${methodText}

REQUIREMENTS
- Makes enough for dinner + 2-4 lunch portions
- Reheats well (tastes good the next day)
- Portable/lunch-friendly format
- Minimal steps (under 8 steps)
- Family-friendly (kids will actually eat it)`;

    } else if (situation === 'one-pot') {
      basePrompt = `I need a complete dinner that can be made in one pot for easy cleanup.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

REQUIREMENTS
- Everything cooks in ONE pot only
- Minimal steps (under 8 steps)
- Complete meal (protein + vegetables + starch all together)
- Family-friendly (kids will actually eat it)`;

    } else if (situation === 'dump-bake') {
      basePrompt = `I need a complete dinner that can be made on one sheet pan in the oven.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

REQUIREMENTS
- Everything cooks on ONE sheet pan in the oven
- Minimal steps (under 6 steps)
- Complete meal (protein + vegetables + starch if possible)
- Family-friendly (kids will actually eat it)`;

    } else {
      // General recipe
      basePrompt = `Create a family recipe for ${profile.adults} adults and ${profile.kids} kids.
      
Dietary preferences: ${profile.dietaryPrefs.join(', ') || 'None'}
Available time: ${timeText}
Cooking level: ${profile.cookingLevel}
Cooking method: ${methodText}
Seasonal preference: ${seasonalText}
Cuisine style: ${cuisineText}
Meal type: ${mealTypeText}
Main ingredients to use: ${profile.ingredients || 'chef\'s choice'}

COOKING PHILOSOPHY:
- Use high-quality, simple ingredients
- Focus on seasonal, fresh ingredients when possible
- Techniques should be approachable but proper
- Make recipes that bring families together`;
    }

    return basePrompt + `

Please provide a JSON response:
{
  "title": "Recipe name",
  "totalTime": "cooking time",
  "servings": "number of servings",
  "ingredients": ["ingredient with quality notes when helpful"],
  "instructions": ["step by step instructions"],
  "tips": ["helpful cooking tips"],
  "notes": "Additional notes or variations"
}

Your entire response must be valid JSON only.`;
  }, []);

  const generateRecipe = useCallback(async (
    situation: string, 
    profile: UserProfile
  ): Promise<Recipe | null> => {
    setLastSituation(situation);
    setLastProfile(profile);

    try {
      const prompt = buildRecipePrompt(situation, profile);
      const response = await executeApiCall(prompt, { maxTokens: 1500 });

      if (response) {
        // Parse the JSON response (same logic as existing components)
        let responseText = response.content?.[0]?.text || '';
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        const recipeData = JSON.parse(responseText);
        
        const recipe: Recipe = {
          id: Date.now(),
          title: recipeData.title || 'Untitled Recipe',
          totalTime: recipeData.totalTime || '30 minutes',
          servings: recipeData.servings || `${profile.adults + profile.kids}`,
          ingredients: recipeData.ingredients || [],
          instructions: recipeData.instructions || [],
          tips: recipeData.tips || [],
          notes: recipeData.notes || '',
          isFavorite: false,
          situation,
          cookingMethod: profile.cookingMethod,
          seasonal: profile.seasonal,
          cuisine: profile.cuisine,
          mealType: profile.mealType,
          createdAt: new Date()
        };

        setCurrentRecipe(recipe);
        
        if (onRecipeGenerated) {
          onRecipeGenerated(recipe);
        }
        
        return recipe;
      }
      
      return null;
      
    } catch (err: any) {
      console.error("Recipe generation error:", err);
      
      // Use fallback if enabled (same logic as existing components)
      if (useFallbacks) {
        const fallbackRecipe = generateFallbackRecipe(situation, profile);
        setCurrentRecipe(fallbackRecipe);
        
        if (onRecipeGenerated) {
          onRecipeGenerated(fallbackRecipe);
        }
        
        return fallbackRecipe;
      }
      
      if (onError) {
        onError(err);
      }
      
      return null;
    }
  }, [buildRecipePrompt, executeApiCall, onRecipeGenerated, onError, useFallbacks]);

  const regenerateRecipe = useCallback(async (): Promise<Recipe | null> => {
    if (!lastSituation || !lastProfile) {
      console.warn('Cannot regenerate: no previous recipe generation found');
      return null;
    }
    
    return generateRecipe(lastSituation, lastProfile);
  }, [generateRecipe, lastSituation, lastProfile]);

  const clearRecipe = useCallback(() => {
    setCurrentRecipe(null);
  }, []);

  const saveRecipe = useCallback((recipe: Recipe) => {
    setSavedRecipes(prev => {
      // Don't save duplicates
      if (prev.find(r => r.id === recipe.id)) {
        return prev;
      }
      return [...prev, recipe];
    });
  }, []);

  const toggleFavorite = useCallback((recipeId: number) => {
    setSavedRecipes(prev => 
      prev.map(recipe => 
        recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    );
    
    if (currentRecipe && currentRecipe.id === recipeId) {
      setCurrentRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  }, [currentRecipe]);

  return {
    currentRecipe,
    loading,
    error,
    generateRecipe,
    regenerateRecipe,
    clearRecipe,
    saveRecipe,
    savedRecipes,
    toggleFavorite
  };
}