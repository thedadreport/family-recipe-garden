// types/recipe.ts
export interface Recipe {
  id: number;
  title: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  notes: string;
  isFavorite: boolean;
  cookingMethod?: string;
  seasonal?: boolean;
  cuisine?: string;
  mealType?: string;
  situation?: string;
  prepTime?: string;
  cookTime?: string;
  prepAhead?: string[];
  isExpanded?: boolean;
}

export interface UserProfile {
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

export interface SituationOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  subtitle: string;
}

export interface TimeOption {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface CookingLevel {
  value: string;
  label: string;
  desc: string;
}

export interface MealType {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface CookingMethod {
  value: string;
  label: string;
  desc: string;
  icon: string;
}

export interface Cuisine {
  value: string;
  label: string;
  desc: string;
  icon: string;
}