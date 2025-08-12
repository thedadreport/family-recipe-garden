import { useState, useCallback } from 'react';
import { useMealPlanApiCall } from './useApiCall';
import { generateFallbackMealPlan, generateFallbackMealDetails } from '../utils/fallbacks';

// Interfaces matching existing component structure
interface WeeklyProfile {
  adults: number;
  kids: number;
  kidAges: string;
  cookingLevel: string;
  dinnersNeeded: number;
  weeknightTimeLimit: number;
  prepTimeAvailable: number;
  proteins: string;
  kitchenEquipment: string[];
  shoppingFrequency: string;
  weeklyBudget: string;
  dietaryRestrictions: string[];
  cuisinePreference: string;
  prepMethods: string[];
}

interface DayMeal {
  day: string;
  title: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  instructions?: string[];
  tips?: string[];
  prepAhead?: string[];
  isExpanded?: boolean;
}

interface ShoppingSection {
  section: string;
  items: Array<{
    item: string;
    quantity: string;
    estimatedCost?: string;
  }>;
}

interface PrepTask {
  day: string;
  tasks: string[];
  timeNeeded: string;
}

interface MealPlan {
  id: number;
  planType: string;
  meals: DayMeal[];
  shoppingList: ShoppingSection[];
  totalCost?: string;
  prepSchedule?: PrepTask[];
  notes: string;
  createdAt?: Date;
}

// Hook options
interface UseMealPlannerOptions {
  onPlanGenerated?: (plan: MealPlan) => void;
  onError?: (error: any) => void;
  useFallbacks?: boolean;
}

// Hook return type
interface UseMealPlannerResult {
  currentPlan: MealPlan | null;
  loading: boolean;
  error: any;
  expandingMealIndex: number | null;
  generateMealPlan: (planType: string, profile: WeeklyProfile) => Promise<MealPlan | null>;
  expandMeal: (mealIndex: number) => Promise<void>;
  regeneratePlan: () => Promise<MealPlan | null>;
  clearPlan: () => void;
  savePlan: (plan: MealPlan) => void;
  savedPlans: MealPlan[];
}

export function useMealPlanner(options: UseMealPlannerOptions = {}): UseMealPlannerResult {
  const { onPlanGenerated, onError, useFallbacks = true } = options;
  
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [expandingMealIndex, setExpandingMealIndex] = useState<number | null>(null);
  const [lastPlanType, setLastPlanType] = useState<string>('');
  const [lastProfile, setLastProfile] = useState<WeeklyProfile | null>(null);

  const { 
    loading, 
    error, 
    execute: executeApiCall 
  } = useMealPlanApiCall({
    onError: (apiError) => {
      if (onError) onError(apiError);
    }
  });

  // Build meal plan prompt based on type and profile
  const buildMealPlanPrompt = useCallback((planType: string, profile: WeeklyProfile): string => {
    let basePrompt = '';

    if (planType === 'budget') {
      basePrompt = `I need to create a weekly meal plan that keeps my grocery costs as low as possible while still feeding my family well.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}${profile.kidAges ? ` (ages: ${profile.kidAges})` : ''}
- Cooking skill level: ${profile.cookingLevel}

PLANNING SCOPE
- How many dinners needed: ${profile.dinnersNeeded} weeknight dinners
- Weeknight cooking time limit: ${profile.weeknightTimeLimit} minutes max

BUDGET CONSTRAINTS
- Weekly grocery budget for dinners: ${profile.weeklyBudget || 'tight budget'}
- Proteins I prefer: ${profile.proteins || 'chicken thighs, ground beef, etc.'}

PREFERENCES
- Dietary restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}
- Cuisine preference: ${profile.cuisinePreference}

REQUIREMENTS
- Stay within my budget without sacrificing nutrition
- Stretch proteins with filling, budget-friendly ingredients
- Use affordable, versatile ingredients across multiple meals
- Simple, family-friendly meals (kids will actually eat them)
- Include cost-per-serving estimates
- Include a shopping list with estimated prices organized by store section`;

    } else if (planType === 'time-saving') {
      basePrompt = `I need a weekly meal plan focused on saving time during busy weeknights through smart prep-ahead strategies.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}${profile.kidAges ? ` (ages: ${profile.kidAges})` : ''}
- Cooking skill level: ${profile.cookingLevel}

PLANNING SCOPE
- How many dinners needed: ${profile.dinnersNeeded} weeknight dinners
- Weeknight cooking time limit: ${profile.weeknightTimeLimit} minutes max
- Prep time available: ${profile.prepTimeAvailable} minutes Sunday afternoon

TIME-SAVING PRIORITIES
- Kitchen equipment available: ${profile.kitchenEquipment.join(', ') || 'slow cooker, instant pot, food processor, etc.'}
- Preferred prep methods: ${profile.prepMethods.join(', ') || 'batch cooking, freezer meals, pre-chopped ingredients, etc.'}

PREFERENCES
- Weekly grocery budget: ${profile.weeklyBudget || 'moderate budget'}
- Dietary restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}
- Cuisine preference: ${profile.cuisinePreference}

REQUIREMENTS
- Minimize weeknight cooking time through strategic prep
- Include specific prep-ahead instructions for each meal
- Simple, family-friendly meals (kids will actually eat them)
- Some meals should be "dump and heat" or "assemble and cook"
- Create a detailed prep schedule (what to do when)
- Include a shopping list organized by store section`;

    } else {
      // General meal planning
      basePrompt = `I need help planning dinners for my family this week.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}${profile.kidAges ? ` (ages: ${profile.kidAges})` : ''}
- Cooking skill level: ${profile.cookingLevel}

PLANNING SCOPE
- How many dinners needed: ${profile.dinnersNeeded} weeknight dinners
- Weeknight cooking time limit: ${profile.weeknightTimeLimit} minutes max

WHAT I HAVE/PREFER
- Proteins I typically buy: ${profile.proteins || 'chicken, ground beef, etc.'}
- Kitchen equipment: ${profile.kitchenEquipment.join(', ') || 'slow cooker, sheet pans, etc.'}
- Grocery shopping frequency: ${profile.shoppingFrequency}

PREFERENCES
- Weekly grocery budget: ${profile.weeklyBudget || 'moderate budget'}
- Dietary restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}
- Cuisine preference: ${profile.cuisinePreference}

REQUIREMENTS
- Simple, family-friendly meals (kids will actually eat them)
- Minimal exotic ingredients
- Some variety but not overwhelming
- Include a shopping list organized by store section`;
    }

    return basePrompt + `

IMPORTANT: Please create exactly ${profile.dinnersNeeded} different meals for the week.

Please provide a JSON response with this structure:
{
  "meals": [
    {
      "day": "Monday",
      "title": "Recipe name",
      "description": "Brief description of the dish and why it fits the plan"
    }
  ],
  "shoppingList": [
    {
      "section": "Produce",
      "items": [
        {"item": "item name", "quantity": "amount", "estimatedCost": "$X.XX"}
      ]
    }
  ],
  "prepSchedule": [
    {
      "day": "Sunday",
      "tasks": ["prep task 1", "prep task 2"],
      "timeNeeded": "X minutes"
    }
  ],
  "totalCost": "$XX.XX",
  "notes": "Additional tips and variations"
}

Your entire response must be valid JSON only.`;
  }, []);

  const generateMealPlan = useCallback(async (
    planType: string, 
    profile: WeeklyProfile
  ): Promise<MealPlan | null> => {
    setLastPlanType(planType);
    setLastProfile(profile);

    try {
      const prompt = buildMealPlanPrompt(planType, profile);
      const response = await executeApiCall(prompt, { maxTokens: 3000 });

      if (response) {
        // Parse the JSON response (same logic as existing components)
        let responseText = response.content?.[0]?.text || '';
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        const planData = JSON.parse(responseText);
        
        const meals = planData.meals.slice(0, profile.dinnersNeeded).map((meal: any) => ({
          ...meal,
          isExpanded: false
        }));
        
        const mealPlan: MealPlan = {
          id: Date.now(),
          planType,
          meals,
          shoppingList: planData.shoppingList || [],
          totalCost: planData.totalCost,
          prepSchedule: planData.prepSchedule,
          notes: planData.notes || '',
          createdAt: new Date()
        };
        
        setCurrentPlan(mealPlan);
        
        if (onPlanGenerated) {
          onPlanGenerated(mealPlan);
        }
        
        return mealPlan;
      }
      
      return null;
      
    } catch (err: any) {
      console.error("Meal plan generation error:", err);
      
      // Use fallback if enabled (same logic as existing components)
      if (useFallbacks) {
        const fallbackPlan = generateFallbackMealPlan(planType, profile.dinnersNeeded);
        setCurrentPlan(fallbackPlan);
        
        if (onPlanGenerated) {
          onPlanGenerated(fallbackPlan);
        }
        
        return fallbackPlan;
      }
      
      if (onError) {
        onError(err);
      }
      
      return null;
    }
  }, [buildMealPlanPrompt, executeApiCall, onPlanGenerated, onError, useFallbacks]);

  const expandMeal = useCallback(async (mealIndex: number): Promise<void> => {
    if (!currentPlan || !currentPlan.meals[mealIndex] || currentPlan.meals[mealIndex].isExpanded) {
      return;
    }
    
    setExpandingMealIndex(mealIndex);
    
    try {
      const meal = currentPlan.meals[mealIndex];
      const prompt = `Create a complete recipe for "${meal.title}" based on this description: "${meal.description}"

FAMILY INFO
- Adults: ${lastProfile?.adults || 2}
- Kids: ${lastProfile?.kids || 2}${lastProfile?.kidAges ? ` (ages: ${lastProfile.kidAges})` : ''}
- Cooking skill level: ${lastProfile?.cookingLevel || 'intermediate'}
- Time limit: ${lastProfile?.weeknightTimeLimit || 45} minutes

REQUIREMENTS
- Family-friendly (kids will actually eat it)
- Fits within time constraints
- Uses common ingredients
- Clear, step-by-step instructions

Please provide a JSON response:
{
  "prepTime": "X minutes",
  "cookTime": "X minutes", 
  "totalTime": "X minutes",
  "ingredients": ["ingredient with amounts"],
  "instructions": ["step by step instructions"],
  "tips": ["helpful cooking tips"],
  "prepAhead": ["what can be done ahead of time"]
}

Your entire response must be valid JSON only.`;

      const response = await executeApiCall(prompt, { maxTokens: 1000 });
      
      if (response) {
        let responseText = response.content?.[0]?.text || '';
        responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        
        const recipeData = JSON.parse(responseText);
        
        const updatedMeals = [...currentPlan.meals];
        updatedMeals[mealIndex] = {
          ...meal,
          ...recipeData,
          isExpanded: true
        };
        
        setCurrentPlan({
          ...currentPlan,
          meals: updatedMeals
        });
      }
      
    } catch (err: any) {
      console.error("Recipe expansion error:", err);
      
      // Use fallback meal details
      const fallbackDetails = generateFallbackMealDetails(
        currentPlan.meals[mealIndex].title, 
        currentPlan.meals[mealIndex].description
      );
      
      const updatedMeals = [...currentPlan.meals];
      updatedMeals[mealIndex] = {
        ...currentPlan.meals[mealIndex],
        ...fallbackDetails,
        isExpanded: true
      };
      
      setCurrentPlan({
        ...currentPlan,
        meals: updatedMeals
      });
    }
    
    setExpandingMealIndex(null);
  }, [currentPlan, lastProfile, executeApiCall]);

  const regeneratePlan = useCallback(async (): Promise<MealPlan | null> => {
    if (!lastPlanType || !lastProfile) {
      console.warn('Cannot regenerate: no previous meal plan generation found');
      return null;
    }
    
    return generateMealPlan(lastPlanType, lastProfile);
  }, [generateMealPlan, lastPlanType, lastProfile]);

  const clearPlan = useCallback(() => {
    setCurrentPlan(null);
  }, []);

  const savePlan = useCallback((plan: MealPlan) => {
    setSavedPlans(prev => {
      // Don't save duplicates
      if (prev.find(p => p.id === plan.id)) {
        return prev;
      }
      return [...prev, plan];
    });
  }, []);

  return {
    currentPlan,
    loading,
    error,
    expandingMealIndex,
    generateMealPlan,
    expandMeal,
    regeneratePlan,
    clearPlan,
    savePlan,
    savedPlans
  };
}