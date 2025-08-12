// utils/constants.ts
import { 
  SituationOption, 
  TimeOption, 
  CookingLevel, 
  MealType, 
  CookingMethod, 
  Cuisine 
} from '../types/recipe';
import { PlanType } from '../types/mealPlan';

export const SITUATION_OPTIONS: SituationOption[] = [
  { 
    value: 'general', 
    label: 'General Recipe', 
    description: 'Create a recipe based on your preferences', 
    icon: '🍳',
    subtitle: 'Classic recipe generation'
  },
  { 
    value: 'protein-random', 
    label: 'Protein + Random Stuff', 
    description: 'You\'re staring into the fridge with some protein and wondering what\'s possible', 
    icon: '🥘',
    subtitle: 'Your Swiss Army knife prompt'
  },
  { 
    value: 'stretch-protein', 
    label: 'Stretch Protein', 
    description: 'Unexpected guests arrived or you misjudged portions at the store', 
    icon: '🍽️',
    subtitle: 'Turn scarcity into abundance'
  },
  { 
    value: 'tomorrow-lunch', 
    label: 'Tonight + Tomorrow\'s Lunch', 
    description: 'You want to solve two meals with one cooking session', 
    icon: '📦',
    subtitle: 'Work smarter, not harder'
  },
  { 
    value: 'one-pot', 
    label: 'One Pot Solution', 
    description: 'You\'re tired and can\'t face a sink full of dishes', 
    icon: '🥄',
    subtitle: 'Everything in one pot'
  },
  { 
    value: 'dump-bake', 
    label: 'Dump and Bake', 
    description: 'You want the oven to do all the work while you rest', 
    icon: '🔥',
    subtitle: 'Let heat do the magic'
  }
];

export const PLAN_TYPES: PlanType[] = [
  {
    value: 'general',
    label: 'Plan My Week',
    description: 'You have 20 minutes on Sunday and want the whole week handled',
    icon: '📅',
    subtitle: 'Sunday you + AI = Weeknight hero'
  },
  {
    value: 'budget',
    label: 'Budget-Conscious Planning',
    description: 'The grocery budget is non-negotiable and every dollar counts',
    icon: '💰',
    subtitle: 'Real families, real budgets'
  },
  {
    value: 'time-saving',
    label: 'Time-Saving Prep',
    description: 'Busy weeks need smart strategies and Sunday work saves Wednesday stress',
    icon: '⏰',
    subtitle: 'Two hours of prep = Five days of peace'
  }
];

export const DIETARY_OPTIONS: string[] = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 
  'Low-carb', 'Paleo', 'Keto', 'High Protein', 'Whole30'
];

export const TIME_OPTIONS: TimeOption[] = [
  { value: 'under30', label: 'Under 30 min', desc: 'Quick & easy', icon: '⚡' },
  { value: '30-60', label: '30-60 min', desc: 'Balanced timing', icon: '⏰' },
  { value: '60plus', label: '60+ min', desc: 'Take your time', icon: '🕐' }
];

export const COOKING_LEVELS: CookingLevel[] = [
  { value: 'beginner', label: 'New to Cooking', desc: 'Let\'s keep it simple' },
  { value: 'intermediate', label: 'Home Cook', desc: 'I know my way around the kitchen' },
  { value: 'advanced', label: 'Experienced', desc: 'I\'m a pro' }
];

export const MEAL_TYPES: MealType[] = [
  { value: 'whole-meal', label: 'Whole Meal', desc: 'Complete dinner', icon: '🍽️' },
  { value: 'side', label: 'Side Dish', desc: 'Perfect accompaniment', icon: '🥗' },
  { value: 'dessert', label: 'Dessert', desc: 'Sweet ending', icon: '🍰' },
  { value: 'snack', label: 'Snack', desc: 'Quick bite', icon: '🥨' }
];

export const COOKING_METHODS: CookingMethod[] = [
  { value: 'sheet-pan', label: 'Sheet Pan', desc: 'One-pan meals', icon: '🍳' },
  { value: 'instant-pot', label: 'Instant Pot', desc: 'Quick cooking', icon: '⚡' },
  { value: 'dutch-oven', label: 'Dutch Oven', desc: 'Slow braising', icon: '🥘' },
  { value: 'stovetop', label: 'Stovetop', desc: 'Classic cooking', icon: '🔥' },
  { value: 'slow-cooker', label: 'Slow Cooker', desc: 'Set & forget', icon: '⏰' },
  { value: 'air-fryer', label: 'Air Fryer', desc: 'Crispy & quick', icon: '💨' },
  { value: 'grill', label: 'Grill', desc: 'Outdoor cooking', icon: '🔥' },
  { value: 'oven', label: 'Oven', desc: 'Baking & roasting', icon: '🏠' }
];

export const CUISINES: Cuisine[] = [
  { value: '', label: 'No Preference', desc: 'Chef\'s choice cuisine', icon: '🌍' },
  { value: 'italian', label: 'Italian', desc: 'Pasta, risotto, fresh herbs', icon: '🇮🇹' },
  { value: 'mexican', label: 'Mexican', desc: 'Bold spices, fresh ingredients', icon: '🇲🇽' },
  { value: 'asian', label: 'Asian', desc: 'Fresh, balanced, umami flavors', icon: '🥢' },
  { value: 'mediterranean', label: 'Mediterranean', desc: 'Olive oil, herbs, vegetables', icon: '🫒' },
  { value: 'indian', label: 'Indian', desc: 'Aromatic spices, rich flavors', icon: '🇮🇳' },
  { value: 'american', label: 'American', desc: 'Comfort food classics', icon: '🇺🇸' },
  { value: 'french', label: 'French', desc: 'Technique-focused, refined', icon: '🇫🇷' },
  { value: 'middle-eastern', label: 'Middle Eastern', desc: 'Warm spices, fresh herbs', icon: '🧄' }
];

export const KITCHEN_EQUIPMENT_OPTIONS: string[] = [
  'Slow cooker', 'Instant pot', 'Air fryer', 'Food processor', 'Stand mixer',
  'Blender', 'Dutch oven', 'Cast iron skillet', 'Sheet pans', 'Grill',
  'Rice cooker', 'Bread maker'
];

export const PREP_METHODS: string[] = [
  'Batch cooking', 'Freezer meals', 'Pre-chopped ingredients',
  'Marinating proteins', 'One-pot meals', 'Sheet pan meals',
  'Slow cooker meals', 'Instant pot meals'
];

export const SHOPPING_FREQUENCIES = [
  { value: 'once-per-week', label: 'Once per week' },
  { value: 'twice-per-week', label: 'Twice per week' },
  { value: 'as-needed', label: 'As needed' }
];

// Default values
export const DEFAULT_USER_PROFILE = {
  adults: 2,
  kids: 2,
  dietaryPrefs: [],
  timeAvailable: 'under30',
  cookingLevel: 'intermediate',
  ingredients: '',
  cookingMethod: '',
  seasonal: false,
  cuisine: '',
  mealType: 'whole-meal'
};

export const DEFAULT_WEEKLY_PROFILE = {
  adults: 2,
  kids: 2,
  kidAges: '',
  cookingLevel: 'intermediate',
  dinnersNeeded: 5,
  weeknightTimeLimit: 45,
  prepTimeAvailable: 120,
  proteins: '',
  kitchenEquipment: [],
  shoppingFrequency: 'once-per-week',
  weeklyBudget: '',
  dietaryRestrictions: [],
  cuisinePreference: 'familiar comfort food',
  prepMethods: []
};