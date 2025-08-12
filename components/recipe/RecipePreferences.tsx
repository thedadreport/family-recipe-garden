import React from 'react';
import { ChefHat } from 'lucide-react';
import { UserProfile } from '../../types/recipe';
import { FormField } from '../common/FormField';
import {
  TIME_OPTIONS,
  MEAL_TYPES,
  COOKING_METHODS,
  CUISINES,
  COOKING_LEVELS
} from '../../utils/constants';

interface RecipePreferencesProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function RecipePreferences({ profile, onUpdateProfile }: RecipePreferencesProps) {
  const handleTimeSelection = (timeValue: string) => {
    onUpdateProfile({ timeAvailable: timeValue });
  };

  const handleMealTypeSelection = (mealTypeValue: string) => {
    onUpdateProfile({ mealType: mealTypeValue });
  };

  const handleCuisineSelection = (cuisineValue: string) => {
    onUpdateProfile({ cuisine: cuisineValue });
  };

  const handleCookingMethodSelection = (methodValue: string) => {
    onUpdateProfile({ cookingMethod: methodValue });
  };

  const handleCookingLevelSelection = (levelValue: string) => {
    onUpdateProfile({ cookingLevel: levelValue });
  };

  const handleSeasonalToggle = (checked: boolean) => {
    onUpdateProfile({ seasonal: checked });
  };

  const handleIngredientsChange = (ingredients: string) => {
    onUpdateProfile({ ingredients });
  };

  return (
    <div className="space-y-8">
      {/* Cooking Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Cooking Time</label>
        <div className="space-y-2">
          {TIME_OPTIONS.map(time => (
            <label
              key={time.value}
              className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all ${
                profile.timeAvailable === time.value
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="timeAvailable"
                value={time.value}
                checked={profile.timeAvailable === time.value}
                onChange={(e) => handleTimeSelection(e.target.value)}
                className="sr-only"
              />
              <span className="text-xl mr-3">{time.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{time.label}</div>
                <div className="text-xs text-gray-600">{time.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* What to Make */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">What to Make</label>
        <div className="grid grid-cols-2 gap-2">
          {MEAL_TYPES.map(mealType => (
            <label
              key={mealType.value}
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer border transition-all ${
                profile.mealType === mealType.value
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="mealType"
                value={mealType.value}
                checked={profile.mealType === mealType.value}
                onChange={(e) => handleMealTypeSelection(e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl mb-2">{mealType.icon}</span>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm">{mealType.label}</div>
                <div className="text-xs text-gray-600">{mealType.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cuisine Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Cuisine Style</label>
        <div className="grid grid-cols-2 gap-2">
          {CUISINES.map(cuisine => (
            <label
              key={cuisine.value}
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer border transition-all ${
                profile.cuisine === cuisine.value
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="cuisine"
                value={cuisine.value}
                checked={profile.cuisine === cuisine.value}
                onChange={(e) => handleCuisineSelection(e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl mb-2">{cuisine.icon}</span>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm">{cuisine.label}</div>
                <div className="text-xs text-gray-600">{cuisine.desc}</div>
              </div>
            </label>
          ))}
        </div>
        
        {/* Seasonal Toggle */}
        <div className="mt-4">
          <label className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={profile.seasonal}
              onChange={(e) => handleSeasonalToggle(e.target.checked)}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">Use Seasonal Ingredients</div>
              <div className="text-xs text-gray-600">Focus on what's fresh right now</div>
            </div>
            <span className="ml-auto text-2xl">🌿</span>
          </label>
        </div>
      </div>

      {/* Cooking Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Cooking Method</label>
        <div className="grid grid-cols-2 gap-2">
          {COOKING_METHODS.map(method => (
            <label
              key={method.value}
              className={`flex flex-col items-center p-4 rounded-xl cursor-pointer border transition-all ${
                profile.cookingMethod === method.value
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="cookingMethod"
                value={method.value}
                checked={profile.cookingMethod === method.value}
                onChange={(e) => handleCookingMethodSelection(e.target.value)}
                className="sr-only"
              />
              <span className="text-2xl mb-2">{method.icon}</span>
              <div className="text-center">
                <div className="font-medium text-gray-900 text-sm">{method.label}</div>
                <div className="text-xs text-gray-600">{method.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Cooking Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Cooking Experience</label>
        {COOKING_LEVELS.map(level => (
          <label
            key={level.value}
            className={`flex items-center p-4 rounded-xl cursor-pointer border transition-all mb-2 ${
              profile.cookingLevel === level.value
                ? 'bg-gray-50 border-gray-900'
                : 'bg-gray-50 border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="cookingLevel"
              value={level.value}
              checked={profile.cookingLevel === level.value}
              onChange={(e) => handleCookingLevelSelection(e.target.value)}
              className="sr-only"
            />
            <ChefHat className={`h-5 w-5 mr-4 ${profile.cookingLevel === level.value ? 'text-gray-700' : 'text-gray-400'}`} />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{level.label}</div>
              <div className="text-sm text-gray-600">{level.desc}</div>
            </div>
          </label>
        ))}
      </div>

      {/* Ingredients */}
      <FormField
        label="Ingredients on Hand"
        type="textarea"
        placeholder="What ingredients do you have? (optional)"
        value={profile.ingredients}
        onChange={handleIngredientsChange}
        rows={3}
      />
    </div>
  );
}