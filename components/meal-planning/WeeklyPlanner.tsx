import React, { useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { MealPlan, WeeklyProfile, DayMeal } from '../../types/mealPlan';
import { DEFAULT_WEEKLY_PROFILE } from '../../utils/constants';
import { PlanTypeSelector } from './PlanTypeSelector';
import { WeeklyProfileForm } from './WeeklyProfileForm';
import { MealPlanDisplay } from './MealPlanDisplay';
import { Button } from '../common/Button';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface WeeklyPlannerProps {
  onNavigateToCollection?: () => void;
  savedPlansCount?: number;
}

type Step = 'planning' | 'plan' | 'saved';

export function WeeklyPlanner({ onNavigateToCollection, savedPlansCount = 0 }: WeeklyPlannerProps) {
  const [currentStep, setCurrentStep] = useState<Step>('planning');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('general');
  const [weeklyProfile, setWeeklyProfile] = useState<WeeklyProfile>(DEFAULT_WEEKLY_PROFILE);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandingMealIndex, setExpandingMealIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = (updates: Partial<WeeklyProfile>) => {
    setWeeklyProfile(prev => ({ ...prev, ...updates }));
  };

  const generateMealPlan = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt = buildMealPlanPrompt(selectedPlanType, weeklyProfile);
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text.trim();
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const planData = JSON.parse(responseText);
      
      const meals = planData.meals.slice(0, weeklyProfile.dinnersNeeded).map((meal: any) => ({
        ...meal,
        isExpanded: false
      }));
      
      const mealPlan: MealPlan = {
        id: Date.now(),
        planType: selectedPlanType,
        meals: meals,
        shoppingList: planData.shoppingList || [],
        totalCost: planData.totalCost,
        prepSchedule: planData.prepSchedule,
        notes: planData.notes
      };
      
      setCurrentMealPlan(mealPlan);
      setCurrentStep('plan');
    } catch (error) {
      console.error("Meal plan generation error:", error);
      setError("Failed to generate meal plan. Please try again.");
      
      // Show fallback meal plan
      setCurrentMealPlan(createFallbackMealPlan(selectedPlanType, weeklyProfile));
      setCurrentStep('plan');
    }
    
    setLoading(false);
  };

  const buildMealPlanPrompt = (planType: string, profile: WeeklyProfile): string => {
    const baseInfo = `Family: ${profile.adults} adults, ${profile.kids} kids
Dinners needed: ${profile.dinnersNeeded}
Time limit: ${profile.weeknightTimeLimit} minutes
Skill level: ${profile.cookingLevel}
Dietary restrictions: ${profile.dietaryRestrictions.join(', ') || 'None'}
Proteins: ${profile.proteins || 'chef\'s choice'}`;

    const prompts = {
      'general': `Plan ${profile.dinnersNeeded} weeknight dinners. ${baseInfo}`,
      'budget': `Create budget-friendly meal plan. Budget: ${profile.weeklyBudget}. ${baseInfo}`,
      'time-saving': `Time-saving meal plan with ${profile.prepTimeAvailable} min Sunday prep. ${baseInfo}`
    };

    const prompt = prompts[planType as keyof typeof prompts] || prompts.general;
    
    return `${prompt}

Please provide a JSON response:
{
  "meals": [
    {
      "day": "Monday",
      "title": "Recipe name", 
      "description": "Brief description"
    }
  ],
  "shoppingList": [
    {
      "section": "Produce",
      "items": [{"item": "item name", "quantity": "amount", "estimatedCost": "$X.XX"}]
    }
  ],
  "prepSchedule": [
    {
      "day": "Sunday",
      "tasks": ["prep task 1"],
      "timeNeeded": "X minutes"
    }
  ],
  "totalCost": "$XX.XX",
  "notes": "Additional tips"
}

Your entire response must be valid JSON only.`;
  };

  const createFallbackMealPlan = (planType: string, profile: WeeklyProfile): MealPlan => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const fallbackMeals = [
      { title: "One-Pot Chicken and Rice", description: "Easy one-pot meal with chicken and vegetables" },
      { title: "Sheet Pan Sausage Dinner", description: "Simple sheet pan meal with minimal cleanup" },
      { title: "Quick Beef Tacos", description: "Family-friendly taco night with fresh toppings" },
      { title: "Baked Chicken with Vegetables", description: "Healthy baked dinner with seasonal vegetables" },
      { title: "Pasta with Meat Sauce", description: "Classic comfort food the whole family loves" },
      { title: "Stir-Fry with Rice", description: "Quick and colorful vegetable stir-fry" },
      { title: "Slow Cooker Chili", description: "Set-and-forget comfort meal" }
    ];
    
    const meals: DayMeal[] = Array.from({ length: profile.dinnersNeeded }, (_, index) => ({
      day: days[index],
      title: fallbackMeals[index % fallbackMeals.length].title,
      description: fallbackMeals[index % fallbackMeals.length].description,
      isExpanded: false
    }));

    return {
      id: Date.now(),
      planType: planType,
      meals: meals,
      shoppingList: [
        {
          section: "Meat",
          items: [
            { item: "Chicken thighs", quantity: "2 lbs", estimatedCost: "$8.00" },
            { item: "Ground beef", quantity: "1 lb", estimatedCost: "$7.00" }
          ]
        },
        {
          section: "Produce", 
          items: [
            { item: "Yellow onion", quantity: "2 large", estimatedCost: "$2.00" },
            { item: "Bell peppers", quantity: "3", estimatedCost: "$4.00" }
          ]
        }
      ],
      totalCost: "$45.00",
      prepSchedule: planType === 'time-saving' ? [
        {
          day: "Sunday",
          tasks: ["Wash and chop vegetables", "Season proteins"],
          timeNeeded: "45 minutes"
        }
      ] : undefined,
      notes: "Simple, family-friendly meals with minimal prep required."
    };
  };

  const expandMeal = async (mealIndex: number) => {
    if (!currentMealPlan) return;
    
    const meal = currentMealPlan.meals[mealIndex];
    if (meal.isExpanded) return;
    
    setExpandingMealIndex(mealIndex);
    
    try {
      const prompt = `Create a complete recipe for "${meal.title}": ${meal.description}

Family: ${weeklyProfile.adults} adults, ${weeklyProfile.kids} kids
Time limit: ${weeklyProfile.weeknightTimeLimit} minutes
Skill level: ${weeklyProfile.cookingLevel}

Please provide a JSON response:
{
  "prepTime": "X minutes",
  "cookTime": "X minutes", 
  "totalTime": "X minutes",
  "ingredients": ["ingredient with amounts"],
  "instructions": ["step by step instructions"],
  "tips": ["helpful tips"],
  "prepAhead": ["what can be done ahead"]
}

Your entire response must be valid JSON only.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      let responseText = data.content[0].text.trim();
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      
      const recipeData = JSON.parse(responseText);
      
      const updatedMeals = [...currentMealPlan.meals];
      updatedMeals[mealIndex] = {
        ...meal,
        ...recipeData,
        isExpanded: true
      };
      
      setCurrentMealPlan({
        ...currentMealPlan,
        meals: updatedMeals
      });
      
    } catch (error) {
      console.error("Recipe expansion error:", error);
      
      // Fallback expanded content
      const updatedMeals = [...currentMealPlan.meals];
      updatedMeals[mealIndex] = {
        ...meal,
        prepTime: "15 minutes",
        cookTime: "30 minutes",
        totalTime: "45 minutes",
        ingredients: ["Main protein", "Vegetables", "Seasonings", "Cooking oil"],
        instructions: ["Prep ingredients", "Cook protein", "Add vegetables", "Season and serve"],
        tips: ["Taste and adjust seasoning"],
        prepAhead: ["Chop vegetables ahead of time"],
        isExpanded: true
      };
      
      setCurrentMealPlan({
        ...currentMealPlan,
        meals: updatedMeals
      });
    }
    
    setExpandingMealIndex(null);
  };

  const savePlan = (plan: MealPlan) => {
    if (!savedPlans.find(p => p.id === plan.id)) {
      setSavedPlans([...savedPlans, plan]);
    }
  };

  const resetToPlanning = () => {
    setCurrentStep('planning');
    setCurrentMealPlan(null);
    setError(null);
    setExpandingMealIndex(null);
  };

  if (currentStep === 'plan' && currentMealPlan) {
    return (
      <ErrorBoundary>
        <MealPlanDisplay
          mealPlan={currentMealPlan}
          weeklyProfile={weeklyProfile}
          onBackToPlanning={resetToPlanning}
          onNavigateToCollection={onNavigateToCollection}
          onSavePlan={savePlan}
          onExpandMeal={expandMeal}
          expandingMealIndex={expandingMealIndex}
          savedPlansCount={savedPlansCount}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mx-auto mb-5 flex items-center justify-center shadow-sm">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
              Weekly Meal Planner
            </h1>
            <p className="text-gray-600 text-base">Plan your week with AI-powered meal planning</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            <PlanTypeSelector
              selectedPlanType={selectedPlanType}
              onPlanTypeChange={setSelectedPlanType}
            />

            <WeeklyProfileForm
              profile={weeklyProfile}
              onProfileChange={updateProfile}
              selectedPlanType={selectedPlanType}
            />

            <Button
              variant="primary"
              size="lg"
              onClick={generateMealPlan}
              loading={loading}
              icon={<ArrowRight className="h-5 w-5" />}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating your meal plan...' : 'Generate Weekly Plan'}
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