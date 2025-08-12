// Validation utilities for Family Recipe Garden
// Based on the interfaces from the existing React components

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Core validation functions
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const isValidNumber = (value: any, min?: number, max?: number): boolean => {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  return true;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidBudget = (budget: string): boolean => {
  if (!budget.trim()) return true; // Optional field
  const cleanBudget = budget.replace(/[$,\s]/g, '');
  return isValidNumber(cleanBudget, 1);
};

// Single recipe form validation (matching the existing userProfile interface)
export const validateRecipeProfile = (profile: {
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
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Family size validation
  if (!isValidNumber(profile.adults, 1, 10)) {
    errors.push({
      field: 'adults',
      message: 'Number of adults must be between 1 and 10'
    });
  }

  if (!isValidNumber(profile.kids, 0, 10)) {
    errors.push({
      field: 'kids',
      message: 'Number of kids must be between 0 and 10'
    });
  }

  // Time validation
  if (profile.timeAvailable && !['under30', '30-60', '60plus'].includes(profile.timeAvailable)) {
    errors.push({
      field: 'timeAvailable',
      message: 'Please select a valid time option'
    });
  }

  // Cooking level validation
  if (profile.cookingLevel && !['beginner', 'intermediate', 'advanced'].includes(profile.cookingLevel)) {
    errors.push({
      field: 'cookingLevel',
      message: 'Please select a valid cooking level'
    });
  }

  // Meal type validation
  if (profile.mealType && !['whole-meal', 'side', 'dessert', 'snack'].includes(profile.mealType)) {
    errors.push({
      field: 'mealType',
      message: 'Please select a valid meal type'
    });
  }

  return errors;
};

// Weekly planning form validation (matching the existing weeklyProfile interface)
export const validateWeeklyProfile = (profile: {
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
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Family size validation
  if (!isValidNumber(profile.adults, 1, 10)) {
    errors.push({
      field: 'adults',
      message: 'Number of adults must be between 1 and 10'
    });
  }

  if (!isValidNumber(profile.kids, 0, 10)) {
    errors.push({
      field: 'kids',
      message: 'Number of kids must be between 0 and 10'
    });
  }

  // Dinners needed validation
  if (!isValidNumber(profile.dinnersNeeded, 1, 7)) {
    errors.push({
      field: 'dinnersNeeded',
      message: 'Number of dinners needed must be between 1 and 7'
    });
  }

  // Time limits validation
  if (!isValidNumber(profile.weeknightTimeLimit, 15, 120)) {
    errors.push({
      field: 'weeknightTimeLimit',
      message: 'Weeknight time limit must be between 15 and 120 minutes'
    });
  }

  if (profile.prepTimeAvailable && !isValidNumber(profile.prepTimeAvailable, 30, 300)) {
    errors.push({
      field: 'prepTimeAvailable',
      message: 'Prep time must be between 30 and 300 minutes'
    });
  }

  // Budget validation
  if (profile.weeklyBudget && !isValidBudget(profile.weeklyBudget)) {
    errors.push({
      field: 'weeklyBudget',
      message: 'Please enter a valid budget amount'
    });
  }

  // Cooking level validation
  if (profile.cookingLevel && !['beginner', 'intermediate', 'advanced'].includes(profile.cookingLevel)) {
    errors.push({
      field: 'cookingLevel',
      message: 'Please select a valid cooking level'
    });
  }

  // Shopping frequency validation
  if (profile.shoppingFrequency && !['once-per-week', 'twice-per-week', 'as-needed'].includes(profile.shoppingFrequency)) {
    errors.push({
      field: 'shoppingFrequency',
      message: 'Please select a valid shopping frequency'
    });
  }

  return errors;
};

// Helper function to check if form has errors
export const hasValidationErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

// Helper function to get error message for a specific field
export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  const fieldError = errors.find(error => error.field === fieldName);
  return fieldError?.message;
};

// Form validation state interface
export interface ValidationState {
  errors: ValidationError[];
  isValid: boolean;
  touched: Record<string, boolean>;
}

export const createInitialValidationState = (): ValidationState => ({
  errors: [],
  isValid: true,
  touched: {}
});

// Update validation state helper
export const updateValidationState = (
  currentState: ValidationState,
  newErrors: ValidationError[],
  touchedField?: string
): ValidationState => {
  const touched = touchedField 
    ? { ...currentState.touched, [touchedField]: true }
    : currentState.touched;

  return {
    errors: newErrors,
    isValid: newErrors.length === 0,
    touched
  };
};