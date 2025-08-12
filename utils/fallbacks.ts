// Fallback generators for Family Recipe Garden
// Provides reliable backup recipes and meal plans when API calls fail

// Fallback recipe templates by situation
const FALLBACK_RECIPES = {
  general: {
    title: "Garden Herb Pasta with Lemon",
    totalTime: "25 minutes",
    servings: "4-6",
    ingredients: [
      "1 lb good pasta (bucatini or spaghetti)",
      "1/4 cup best-quality olive oil", 
      "3 garlic cloves, thinly sliced",
      "Zest and juice of 2 lemons",
      "1/2 cup freshly grated Parmigiano-Reggiano",
      "2 cups mixed fresh herbs (basil, parsley, mint)",
      "Flaky sea salt and freshly ground black pepper",
      "2 tbsp unsalted butter"
    ],
    instructions: [
      "Bring a large pot of water to boil. Salt generously - it should taste like seawater",
      "Cook pasta until just shy of al dente", 
      "Warm olive oil in large skillet. Add garlic, cook until fragrant",
      "Reserve pasta water, then drain pasta",
      "Add pasta to skillet with garlic oil. Toss with pasta water",
      "Remove from heat. Add lemon, butter, cheese, and herbs",
      "Taste and adjust seasoning. Serve immediately"
    ],
    tips: [
      "Pasta water creates the silky sauce",
      "Taste and adjust as you go",
      "Kids can help wash herbs"
    ],
    notes: "Works with any seasonal vegetables. Use the best ingredients you can find."
  },
  'protein-random': {
    title: "Quick Chicken and Rice Skillet",
    totalTime: "30 minutes", 
    servings: "4",
    ingredients: [
      "1 lb chicken thighs, cut into pieces",
      "1 cup jasmine rice",
      "2 cups chicken broth",
      "1 onion, diced",
      "2 cloves garlic, minced",
      "1 bell pepper, chopped",
      "1 tsp paprika",
      "Salt and pepper to taste",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Heat oil in large skillet over medium-high heat",
      "Season chicken with salt, pepper, and paprika",
      "Cook chicken until browned, remove and set aside",
      "Add onion and pepper to same pan, cook 5 minutes",
      "Add garlic and rice, stir for 1 minute",
      "Add broth and chicken back to pan",
      "Bring to boil, reduce heat, cover and simmer 18 minutes",
      "Let stand 5 minutes, then fluff and serve"
    ],
    tips: [
      "Use chicken thighs for more flavor",
      "Don't lift the lid while cooking rice",
      "Add frozen peas in the last 5 minutes"
    ],
    notes: "Works with any protein and leftover vegetables."
  },
  'stretch-protein': {
    title: "Hearty Pasta with Small Amount of Meat",
    totalTime: "35 minutes",
    servings: "4-6",
    ingredients: [
      "1/2 lb ground beef or turkey",
      "1 lb pasta (penne or rigatoni)",
      "1 can (28 oz) crushed tomatoes",
      "1 can (15 oz) white beans, drained",
      "1 onion, diced",
      "3 cloves garlic, minced",
      "2 tsp Italian seasoning",
      "1/2 cup grated Parmesan",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Heat oil in large pan, cook onion until soft",
      "Add garlic and meat, cook until browned",
      "Add tomatoes, beans, and Italian seasoning",
      "Simmer 15 minutes until thickened",
      "Toss with cooked pasta and Parmesan",
      "Serve hot with extra cheese"
    ],
    tips: [
      "Beans add protein and make it more filling",
      "Use good canned tomatoes for best flavor",
      "Leftovers are even better the next day"
    ],
    notes: "Stretches small amounts of protein to feed everyone well."
  },
  'one-pot': {
    title: "One-Pot Chicken and Vegetables",
    totalTime: "35 minutes",
    servings: "4-5", 
    ingredients: [
      "1 lb chicken thighs",
      "2 cups potatoes, cubed",
      "1 cup carrots, sliced",
      "1 onion, chopped",
      "3 cloves garlic, minced",
      "2 cups chicken broth",
      "1 tsp thyme",
      "Salt and pepper",
      "2 tbsp olive oil"
    ],
    instructions: [
      "Heat oil in large Dutch oven",
      "Season and brown chicken on both sides",
      "Add vegetables and garlic to pot",
      "Pour in broth, add thyme and seasonings",
      "Bring to boil, then reduce heat",
      "Cover and simmer 25 minutes",
      "Check that chicken is cooked through",
      "Serve hot from the pot"
    ],
    tips: [
      "Cut vegetables same size for even cooking",
      "Use whatever vegetables you have on hand",
      "Great for leftovers"
    ],
    notes: "Everything cooks in one pot for easy cleanup."
  },
  'dump-bake': {
    title: "Sheet Pan Chicken and Vegetables",
    totalTime: "40 minutes",
    servings: "4",
    ingredients: [
      "1 lb chicken thighs or breasts",
      "2 cups baby potatoes, halved",
      "2 cups mixed vegetables (broccoli, carrots, bell peppers)",
      "3 tbsp olive oil",
      "2 tsp garlic powder",
      "1 tsp paprika",
      "Salt and pepper",
      "Fresh herbs (optional)"
    ],
    instructions: [
      "Preheat oven to 425°F",
      "Toss all ingredients on sheet pan",
      "Season generously with salt and pepper",
      "Spread in single layer",
      "Bake 35-40 minutes until chicken is cooked",
      "Check vegetables are tender",
      "Serve directly from pan"
    ],
    tips: [
      "Don't overcrowd the pan",
      "Cut vegetables similar sizes",
      "Line pan with parchment for easy cleanup"
    ],
    notes: "Simple sheet pan dinner with minimal cleanup."
  },
  'tomorrow-lunch': {
    title: "Make-Ahead Grain Bowl",
    totalTime: "45 minutes",
    servings: "6-8",
    ingredients: [
      "2 cups quinoa or brown rice",
      "1 lb protein (chicken, chickpeas, or tofu)",
      "4 cups mixed roasted vegetables",
      "1/2 cup nuts or seeds",
      "Simple vinaigrette",
      "2 tbsp olive oil",
      "Salt and pepper",
      "Fresh herbs"
    ],
    instructions: [
      "Cook grain according to package directions",
      "Roast vegetables at 400°F for 25 minutes",
      "Cook protein until done",
      "Let everything cool slightly",
      "Combine grain, vegetables, and protein",
      "Add nuts and herbs",
      "Dress lightly and toss",
      "Store extras in fridge for lunches"
    ],
    tips: [
      "Keep dressing on the side for lunches",
      "Add fresh elements when serving",
      "Great cold or reheated"
    ],
    notes: "Makes dinner plus 2-4 lunch portions that taste good the next day."
  }
};

// Fallback meal plans by type
const FALLBACK_MEAL_PLANS = {
  general: [
    { day: "Monday", title: "One-Pot Chicken and Rice", description: "Easy one-pot meal with chicken, rice, and vegetables" },
    { day: "Tuesday", title: "Sheet Pan Sausage and Vegetables", description: "Simple sheet pan dinner with Italian sausage" },
    { day: "Wednesday", title: "Quick Beef Tacos", description: "Family-friendly taco night with ground beef" },
    { day: "Thursday", title: "Baked Chicken with Sweet Potatoes", description: "Healthy baked chicken with roasted sweet potatoes" },
    { day: "Friday", title: "Pasta with Meat Sauce", description: "Classic comfort food with hearty meat sauce" }
  ],
  budget: [
    { day: "Monday", title: "Hearty Bean and Rice Bowl", description: "Budget-friendly protein with beans and rice" },
    { day: "Tuesday", title: "Egg Fried Rice", description: "Use leftover rice with eggs and frozen vegetables" },
    { day: "Wednesday", title: "Lentil Soup with Bread", description: "Filling lentil soup that stretches the budget" },
    { day: "Thursday", title: "Pasta with Simple Tomato Sauce", description: "Basic pasta dish with canned tomatoes" },
    { day: "Friday", title: "Chicken Thigh and Potato Bake", description: "Inexpensive chicken thighs with potatoes" }
  ],
  'time-saving': [
    { day: "Monday", title: "Slow Cooker Chicken", description: "Set it in the morning, dinner ready when you get home" },
    { day: "Tuesday", title: "15-Minute Pasta", description: "Quick pasta with pre-prepped ingredients" },
    { day: "Wednesday", title: "Sheet Pan Fajitas", description: "Everything cooks on one pan" },
    { day: "Thursday", title: "Instant Pot Rice and Beans", description: "Pressure cooker makes this super fast" },
    { day: "Friday", title: "Pre-Made Freezer Meal", description: "Heat up meal prepped on Sunday" }
  ]
};

// Generate fallback recipe based on situation and profile
export const generateFallbackRecipe = (
  situation: string,
  profile: {
    adults: number;
    kids: number;
    cookingMethod?: string;
    seasonal?: boolean;
    cuisine?: string;
    mealType?: string;
  },
  customTitle?: string
): {
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
} => {
  const baseRecipe = FALLBACK_RECIPES[situation as keyof typeof FALLBACK_RECIPES] || FALLBACK_RECIPES.general;
  
  return {
    id: Date.now(),
    title: customTitle || baseRecipe.title,
    totalTime: baseRecipe.totalTime,
    servings: `${profile.adults + profile.kids}`,
    ingredients: baseRecipe.ingredients,
    instructions: baseRecipe.instructions,
    tips: baseRecipe.tips,
    notes: baseRecipe.notes,
    isFavorite: false,
    situation,
    cookingMethod: profile.cookingMethod,
    seasonal: profile.seasonal,
    cuisine: profile.cuisine,
    mealType: profile.mealType,
    createdAt: new Date()
  };
};

// Generate fallback shopping list
export const generateFallbackShoppingList = (planType: string, mealsCount: number): Array<{
  section: string;
  items: Array<{
    item: string;
    quantity: string;
    estimatedCost?: string;
  }>;
}> => {
  const baseShopping = [
    {
      section: "Meat & Poultry",
      items: [
        { item: "Chicken thighs", quantity: "2 lbs", estimatedCost: "$8.00" },
        { item: "Ground beef", quantity: "1 lb", estimatedCost: "$7.00" }
      ]
    },
    {
      section: "Produce", 
      items: [
        { item: "Yellow onions", quantity: "2 large", estimatedCost: "$2.00" },
        { item: "Bell peppers", quantity: "3", estimatedCost: "$4.00" },
        { item: "Garlic", quantity: "1 head", estimatedCost: "$1.00" },
        { item: "Carrots", quantity: "1 lb bag", estimatedCost: "$2.00" }
      ]
    },
    {
      section: "Pantry",
      items: [
        { item: "Rice", quantity: "2 lb bag", estimatedCost: "$3.00" },
        { item: "Pasta", quantity: "2 boxes", estimatedCost: "$4.00" },
        { item: "Olive oil", quantity: "1 bottle", estimatedCost: "$6.00" },
        { item: "Canned tomatoes", quantity: "3 cans", estimatedCost: "$5.00" }
      ]
    },
    {
      section: "Dairy",
      items: [
        { item: "Eggs", quantity: "1 dozen", estimatedCost: "$3.00" },
        { item: "Parmesan cheese", quantity: "8 oz", estimatedCost: "$5.00" }
      ]
    }
  ];

  // Adjust for budget plans
  if (planType === 'budget') {
    baseShopping.forEach(section => {
      section.items.forEach(item => {
        if (item.estimatedCost) {
          const cost = parseFloat(item.estimatedCost.replace('$', ''));
          item.estimatedCost = `$${(cost * 0.8).toFixed(2)}`;
        }
      });
    });
  }

  return baseShopping;
};

// Generate fallback meal plan
export const generateFallbackMealPlan = (
  planType: string,
  mealsNeeded: number
): {
  id: number;
  planType: string;
  meals: Array<{
    day: string;
    title: string;
    description: string;
    isExpanded?: boolean;
  }>;
  shoppingList: Array<{
    section: string;
    items: Array<{
      item: string;
      quantity: string;
      estimatedCost?: string;
    }>;
  }>;
  totalCost?: string;
  prepSchedule?: Array<{
    day: string;
    tasks: string[];
    timeNeeded: string;
  }>;
  notes: string;
  createdAt?: Date;
} => {
  const baseMeals = FALLBACK_MEAL_PLANS[planType as keyof typeof FALLBACK_MEAL_PLANS] || FALLBACK_MEAL_PLANS.general;
  
  const meals = baseMeals.slice(0, mealsNeeded).map(meal => ({
    ...meal,
    isExpanded: false
  }));

  const shoppingList = generateFallbackShoppingList(planType, mealsNeeded);
  
  const totalCost = shoppingList.reduce((total, section) => {
    const sectionTotal = section.items.reduce((sectionSum, item) => {
      if (item.estimatedCost) {
        const cost = parseFloat(item.estimatedCost.replace('$', ''));
        return sectionSum + cost;
      }
      return sectionSum;
    }, 0);
    return total + sectionTotal;
  }, 0);

  const prepSchedule = planType === 'time-saving' ? [
    {
      day: "Sunday",
      tasks: [
        "Wash and chop all vegetables",
        "Season proteins and store in fridge", 
        "Cook rice for the week",
        "Prep freezer meal for Friday"
      ],
      timeNeeded: "60 minutes"
    }
  ] : undefined;

  return {
    id: Date.now(),
    planType,
    meals,
    shoppingList,
    totalCost: `$${totalCost.toFixed(2)}`,
    prepSchedule,
    notes: "This plan focuses on simple, family-friendly meals with minimal prep.",
    createdAt: new Date()
  };
};

// Generate fallback expanded meal details
export const generateFallbackMealDetails = (mealTitle: string, mealDescription: string) => {
  return {
    prepTime: "15 minutes",
    cookTime: "30 minutes",
    totalTime: "45 minutes",
    ingredients: [
      "Main protein (chicken, beef, etc.)",
      "Vegetables (onion, garlic, etc.)",
      "Starch (rice, pasta, potatoes)",
      "Seasonings (salt, pepper, herbs)",
      "Cooking oil or butter"
    ],
    instructions: [
      "Prep all ingredients first",
      "Heat oil in large pan or pot", 
      "Cook protein until done",
      "Add vegetables and cook until tender",
      "Add seasonings and combine",
      "Serve hot with starch"
    ],
    tips: [
      "Taste and adjust seasoning",
      "Don't overcook the vegetables",
      "Let meat rest before serving"
    ],
    prepAhead: [
      "Chop vegetables ahead of time",
      "Season protein the night before"
    ]
  };
};

// Error messages for different failure scenarios
export const FALLBACK_ERROR_MESSAGES = {
  apiFailure: "We're having trouble connecting to our recipe service right now, but here's a reliable family favorite to get you started!",
  parseError: "Something went wrong with the recipe generation, but we've got a backup plan that families love.",
  timeoutError: "The recipe is taking longer than usual to generate. Here's a quick solution while we work on your custom recipe.",
  networkError: "Looks like there's a connection issue. Here's a tried-and-true recipe that doesn't need the internet!",
  generalError: "Something unexpected happened, but don't worry - here's a delicious backup recipe that always works."
};

// Get appropriate error message based on error type
export const getFallbackMessage = (errorType: string): string => {
  return FALLBACK_ERROR_MESSAGES[errorType as keyof typeof FALLBACK_ERROR_MESSAGES] || FALLBACK_ERROR_MESSAGES.generalError;
};