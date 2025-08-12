// Meal plan-specific API service for generating meal plans with Claude

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

// Meal plan generation options
interface MealPlanGenerationOptions {
  maxTokens?: number;
  includePrepSchedule?: boolean;
  includeShoppingList?: boolean;
  includeCostEstimates?: boolean;
  focusOnVariety?: boolean;
}

// Claude API call function (matching existing pattern)
const claudeApiCall = async (prompt: string, options: { maxTokens?: number } = {}): Promise<any> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 3000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
};

class MealPlanApiService {
  // Build meal plan prompt based on type and profile
  private buildMealPlanPrompt(planType: string, profile: WeeklyProfile, options: MealPlanGenerationOptions = {}): string {
    let basePrompt = '';

    switch (planType) {
      case 'budget':
        basePrompt = this.buildBudgetPlanPrompt(profile);
        break;
      case 'time-saving':
        basePrompt = this.buildTimeSavingPlanPrompt(profile);
        break;
      default:
        basePrompt = this.buildGeneralPlanPrompt(profile);
    }

    return basePrompt + this.buildResponseFormat(profile, options);
  }

  private buildBudgetPlanPrompt(profile: WeeklyProfile): string {
    return `I need to create a weekly meal plan that keeps my grocery costs as low as possible while still feeding my family well.

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
  }

  private buildTimeSavingPlanPrompt(profile: WeeklyProfile): string {
    return `I need a weekly meal plan focused on saving time during busy weeknights through smart prep-ahead strategies.

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
  }

  private buildGeneralPlanPrompt(profile: WeeklyProfile): string {
    return `I need help planning dinners for my family this week.

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

  private buildResponseFormat(profile: WeeklyProfile, options: MealPlanGenerationOptions): string {
    const prepScheduleSection = (options.includePrepSchedule !== false && profile.prepTimeAvailable > 0) ? 
      `,\n  "prepSchedule": [\n    {\n      "day": "Sunday",\n      "tasks": ["prep task 1", "prep task 2"],\n      "timeNeeded": "X minutes"\n    }\n  ]` : '';

    const shoppingListSection = options.includeShoppingList !== false ?
      `,\n  "shoppingList": [\n    {\n      "section": "Produce",\n      "items": [\n        {"item": "item name", "quantity": "amount", "estimatedCost": "$X.XX"}\n      ]\n    }\n  ]` : '';

    const totalCostSection = options.includeCostEstimates !== false ? `,\n  "totalCost": "$XX.XX"` : '';

    return `

IMPORTANT: Please create exactly ${profile.dinnersNeeded} different meals for the week.

Please provide a JSON response with this structure:
{
  "meals": [
    {
      "day": "Monday",
      "title": "Recipe name",
      "description": "Brief description of the dish and why it fits the plan"
    }
  ]${shoppingListSection}${prepScheduleSection}${totalCostSection},
  "notes": "Additional tips and variations"
}

Your entire response must be valid JSON only.`;
  }

  // Generate meal plan using Claude API
  async generateMealPlan(
    planType: string,
    profile: WeeklyProfile,
    options: MealPlanGenerationOptions = {}
  ): Promise<MealPlan> {
    const prompt = this.buildMealPlanPrompt(planType, profile, options);
    
    const response = await claudeApiCall(prompt, { 
      maxTokens: options.maxTokens || 3000 
    });
    
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
    
    return mealPlan;
  }

  // Expand individual meal with full recipe details
  async expandMeal(
    meal: DayMeal,
    profile: WeeklyProfile
  ): Promise<DayMeal> {
    const prompt = `Create a complete recipe for "${meal.title}" based on this description: "${meal.description}"

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}${profile.kidAges ? ` (ages: ${profile.kidAges})` : ''}
- Cooking skill level: ${profile.cookingLevel}
- Time limit: ${profile.weeknightTimeLimit} minutes

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

    const response = await claudeApiCall(prompt, { maxTokens: 1000 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const recipeData = JSON.parse(responseText);
    
    return {
      ...meal,
      ...recipeData,
      isExpanded: true
    };
  }

  // Generate alternative meal plans
  async generateMealPlanAlternatives(
    planType: string,
    profile: WeeklyProfile,
    count: number = 2,
    options: MealPlanGenerationOptions = {}
  ): Promise<MealPlan[]> {
    const plans: MealPlan[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // Add variation to prompts
        const modifiedProfile = { ...profile };
        if (i > 0) {
          modifiedProfile.cuisinePreference += ` (variation ${i + 1})`;
        }
        
        const plan = await this.generateMealPlan(planType, modifiedProfile, options);
        plan.id = Date.now() + i; // Ensure unique IDs
        plans.push(plan);
        
        // Small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error generating meal plan alternative ${i + 1}:`, error);
        // Continue with other alternatives
      }
    }
    
    return plans;
  }

  // Modify existing meal plan for dietary restrictions
  async modifyPlanForDiet(
    basePlan: MealPlan,
    dietaryRestriction: string
  ): Promise<MealPlan> {
    const mealTitles = basePlan.meals.map(meal => meal.title).join(', ');
    
    const prompt = `Modify this meal plan to be ${dietaryRestriction}:

ORIGINAL MEALS: ${mealTitles}

DIETARY MODIFICATION: ${dietaryRestriction}

Please provide a JSON response with modified meals and updated shopping list:
{
  "meals": [
    {
      "day": "Monday",
      "title": "Modified recipe name",
      "description": "Brief description of the modified dish"
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
  "totalCost": "$XX.XX",
  "notes": "Notes about the dietary modifications made"
}

Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 2000 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const modifiedData = JSON.parse(responseText);
    
    const modifiedPlan: MealPlan = {
      ...basePlan,
      id: Date.now(),
      meals: modifiedData.meals.map((meal: any) => ({ ...meal, isExpanded: false })),
      shoppingList: modifiedData.shoppingList || basePlan.shoppingList,
      totalCost: modifiedData.totalCost || basePlan.totalCost,
      notes: modifiedData.notes || basePlan.notes,
      createdAt: new Date()
    };

    return modifiedPlan;
  }

  // Generate shopping list for multiple meal plans
  async generateCombinedShoppingList(
    plans: MealPlan[]
  ): Promise<ShoppingSection[]> {
    const allMeals = plans.flatMap(plan => plan.meals.map(meal => meal.title)).join(', ');
    
    const prompt = `Create a combined shopping list for these meals: ${allMeals}

Please provide a JSON response with a consolidated shopping list:
{
  "shoppingList": [
    {
      "section": "Produce",
      "items": [
        {"item": "item name", "quantity": "combined amount", "estimatedCost": "$X.XX"}
      ]
    }
  ],
  "totalCost": "$XX.XX"
}

Combine similar items and adjust quantities appropriately.
Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 1500 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const shoppingData = JSON.parse(responseText);
    
    return shoppingData.shoppingList || [];
  }

  // Generate prep schedule for meal plan
  async generatePrepSchedule(
    plan: MealPlan,
    prepTimeAvailable: number
  ): Promise<PrepTask[]> {
    const mealTitles = plan.meals.map(meal => meal.title).join(', ');
    
    const prompt = `Create a prep schedule for these meals: ${mealTitles}

Available prep time: ${prepTimeAvailable} minutes on Sunday

Please provide a JSON response with a detailed prep schedule:
{
  "prepSchedule": [
    {
      "day": "Sunday",
      "tasks": ["specific prep task 1", "specific prep task 2"],
      "timeNeeded": "X minutes"
    }
  ]
}

Focus on tasks that will save time during the week.
Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 1000 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const prepData = JSON.parse(responseText);
    
    return prepData.prepSchedule || [];
  }

  // Scale meal plan for different family size
  async scaleMealPlan(
    basePlan: MealPlan,
    newAdults: number,
    newKids: number
  ): Promise<MealPlan> {
    const originalSize = basePlan.meals.length; // Using meals count as a proxy
    const newTotalPeople = newAdults + newKids;
    const originalPeople = 4; // Assume original was for 4 people if not specified
    const scaleFactor = newTotalPeople / originalPeople;
    
    const prompt = `Scale this meal plan for ${newAdults} adults and ${newKids} kids (${newTotalPeople} people total):

Scale factor: ${scaleFactor}x

ORIGINAL MEALS: ${basePlan.meals.map(meal => meal.title).join(', ')}

Please provide a JSON response with scaled shopping list and adjusted costs:
{
  "shoppingList": [
    {
      "section": "Produce",
      "items": [
        {"item": "item name", "quantity": "scaled amount", "estimatedCost": "$X.XX"}
      ]
    }
  ],
  "totalCost": "$XX.XX",
  "notes": "Notes about scaling adjustments made"
}

Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 1500 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const scaledData = JSON.parse(responseText);
    
    const scaledPlan: MealPlan = {
      ...basePlan,
      id: Date.now(),
      shoppingList: scaledData.shoppingList || basePlan.shoppingList,
      totalCost: scaledData.totalCost || basePlan.totalCost,
      notes: scaledData.notes || basePlan.notes,
      createdAt: new Date()
    };

    return scaledPlan;
  }
}

// Export singleton instance
export const mealPlanApiService = new MealPlanApiService();