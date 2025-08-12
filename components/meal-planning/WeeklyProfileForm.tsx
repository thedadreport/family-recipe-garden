import React from 'react';
import { WeeklyProfile } from '../../types/mealPlan';
import { FormField } from '../common/FormField';
import {
  COOKING_LEVELS,
  SHOPPING_FREQUENCIES,
  PREP_METHODS,
  KITCHEN_EQUIPMENT_OPTIONS,
  DIETARY_OPTIONS
} from '../../utils/constants';

interface WeeklyProfileFormProps {
  profile: WeeklyProfile;
  onProfileChange: (updates: Partial<WeeklyProfile>) => void;
  selectedPlanType: string;
}

export function WeeklyProfileForm({ profile, onProfileChange, selectedPlanType }: WeeklyProfileFormProps) {
  const handleInputChange = (field: keyof WeeklyProfile) => (value: string | number) => {
    onProfileChange({ [field]: value });
  };

  const toggleArrayItem = (field: keyof WeeklyProfile, item: string) => {
    const currentArray = profile[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    onProfileChange({ [field]: newArray });
  };

  const toggleKitchenEquipment = (equipment: string) => {
    toggleArrayItem('kitchenEquipment', equipment);
  };

  const togglePrepMethod = (method: string) => {
    toggleArrayItem('prepMethods', method);
  };

  const toggleDietaryRestriction = (restriction: string) => {
    toggleArrayItem('dietaryRestrictions', restriction);
  };

  return (
    <div className="space-y-8">
      {/* Family Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Family Information</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <FormField
            label="Adults"
            type="number"
            value={profile.adults}
            onChange={(value) => handleInputChange('adults')(parseInt(value) || 1)}
            min={1}
            max={10}
          />
          <FormField
            label="Children"
            type="number"
            value={profile.kids}
            onChange={(value) => handleInputChange('kids')(parseInt(value) || 0)}
            min={0}
            max={10}
          />
        </div>
        {profile.kids > 0 && (
          <FormField
            label="Kids Ages (if picky eaters)"
            type="text"
            placeholder="e.g., 3, 7"
            value={profile.kidAges}
            onChange={handleInputChange('kidAges')}
          />
        )}
      </div>

      {/* Planning Scope */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Planning Scope</label>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <FormField
            label="Dinners Needed"
            type="number"
            value={profile.dinnersNeeded}
            onChange={(value) => handleInputChange('dinnersNeeded')(parseInt(value) || 5)}
            min={1}
            max={7}
          />
          <FormField
            label="Weeknight Time Limit (minutes)"
            type="number"
            value={profile.weeknightTimeLimit}
            onChange={(value) => handleInputChange('weeknightTimeLimit')(parseInt(value) || 45)}
            min={15}
            max={120}
          />
        </div>
        {selectedPlanType === 'time-saving' && (
          <FormField
            label="Sunday Prep Time Available (minutes)"
            type="number"
            value={profile.prepTimeAvailable}
            onChange={(value) => handleInputChange('prepTimeAvailable')(parseInt(value) || 120)}
            min={30}
            max={300}
          />
        )}
      </div>

      {/* Cooking Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cooking Experience</label>
        <select
          value={profile.cookingLevel}
          onChange={(e) => handleInputChange('cookingLevel')(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        >
          {COOKING_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label} - {level.desc}
            </option>
          ))}
        </select>
      </div>

      {/* Budget (for budget plan type) */}
      {selectedPlanType === 'budget' && (
        <FormField
          label="Weekly Grocery Budget"
          type="text"
          placeholder="e.g., $75"
          value={profile.weeklyBudget}
          onChange={handleInputChange('weeklyBudget')}
        />
      )}

      {/* Proteins */}
      <FormField
        label="Proteins You Prefer"
        type="text"
        placeholder="e.g., chicken thighs, ground beef, pork shoulder"
        value={profile.proteins}
        onChange={handleInputChange('proteins')}
      />

      {/* Kitchen Equipment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Kitchen Equipment Available</label>
        <div className="flex flex-wrap gap-2">
          {KITCHEN_EQUIPMENT_OPTIONS.map(equipment => (
            <button
              key={equipment}
              onClick={() => toggleKitchenEquipment(equipment)}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                profile.kitchenEquipment.includes(equipment)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {equipment}
            </button>
          ))}
        </div>
      </div>

      {/* Shopping Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Grocery Shopping Frequency</label>
        <select
          value={profile.shoppingFrequency}
          onChange={(e) => handleInputChange('shoppingFrequency')(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        >
          {SHOPPING_FREQUENCIES.map(freq => (
            <option key={freq.value} value={freq.value}>{freq.label}</option>
          ))}
        </select>
      </div>

      {/* Prep Methods (for time-saving plan type) */}
      {selectedPlanType === 'time-saving' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Prep Methods</label>
          <div className="flex flex-wrap gap-2">
            {PREP_METHODS.map(method => (
              <button
                key={method}
                onClick={() => togglePrepMethod(method)}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                  profile.prepMethods.includes(method)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dietary Restrictions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Dietary Restrictions</label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map(restriction => (
            <button
              key={restriction}
              onClick={() => toggleDietaryRestriction(restriction)}
              className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                profile.dietaryRestrictions.includes(restriction)
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {restriction}
            </button>
          ))}
        </div>
      </div>

      {/* Cuisine Preference */}
      <FormField
        label="Cuisine Preference"
        type="text"
        placeholder="e.g., familiar comfort food, Italian, Mexican, Asian"
        value={profile.cuisinePreference}
        onChange={handleInputChange('cuisinePreference')}
      />
    </div>
  );
}