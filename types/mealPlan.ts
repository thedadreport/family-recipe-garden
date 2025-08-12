// types/mealPlan.ts
export interface WeeklyProfile {
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

export interface DayMeal {
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

export interface ShoppingItem {
  item: string;
  quantity: string;
  estimatedCost?: string;
}

export interface ShoppingSection {
  section: string;
  items: ShoppingItem[];
}

export interface PrepTask {
  day: string;
  tasks: string[];
  timeNeeded: string;
}

export interface MealPlan {
  id: number;
  planType: string;
  meals: DayMeal[];
  shoppingList: ShoppingSection[];
  totalCost?: string;
  prepSchedule?: PrepTask[];
  notes: string;
}

export interface PlanType {
  value: string;
  label: string;
  description: string;
  icon: string;
  subtitle: string;
}