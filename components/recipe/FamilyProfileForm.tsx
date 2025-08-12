import React from 'react';
import { ChefHat } from 'lucide-react';

// User profile interface (matching existing component structure)
interface UserProfile {
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

// Component props
interface FamilyProfileFormProps {
  profile: UserProfile;
  onProfileChange: (updates: Partial<UserProfile>) => void;
  errors?: Record<string, string>;
  className?: string;
}

// Configuration options (matches existing component data)
const DIETARY_OPTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Nut-free', 'Low-carb', 'Paleo', 'Keto', 'High Protein', 'Whole30'
];

const TIME_OPTIONS = [
  { value: 'under30', label: 'Under 30 min', desc: 'Quick & easy', icon: '⚡' },
  { value: '30-60', label: '30-60 min', desc: 'Balanced timing', icon: '⏰' },
  { value: '60plus', label: '60+ min', desc: 'Take your time', icon: '🕐' }
];

const COOKING_LEVELS = [
  { value: 'beginner', label: 'New to Cooking', desc: 'Let\'s keep it simple' },
  { value: 'intermediate', label: 'Home Cook', desc: 'I know my way around the kitchen' },
  { value: 'advanced', label: 'Experienced', desc: 'I\'m a pro' }
];

export default function FamilyProfileForm({
  profile,
  onProfileChange,
  errors = {},
  className = ''
}: FamilyProfileFormProps) {
  
  const toggleDietaryPref = (pref: string) => {
    const newPrefs = profile.dietaryPrefs.includes(pref)
      ? profile.dietaryPrefs.filter(p => p !== pref)
      : [...profile.dietaryPrefs, pref];
    onProfileChange({ dietaryPrefs: newPrefs });
  };

  return (
    <div className={`space-y-8 ${className}`}>
      
      {/* Family Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Family Size
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Adults</label>
            <input
              type="number"
              min="1"
              max="10"
              value={profile.adults}
              onChange={(e) => onProfileChange({ adults: parseInt(e.target.value) || 1 })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-base font-medium text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none ${
                errors.adults ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.adults ? 'adults-error' : undefined}
            />
            {errors.adults && (
              <div id="adults-error" className="text-xs text-red-600 mt-1">
                {errors.adults}
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Children</label>
            <input
              type="number"
              min="0"
              max="10"
              value={profile.kids}
              onChange={(e) => onProfileChange({ kids: parseInt(e.target.value) || 0 })}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-base font-medium text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none ${
                errors.kids ? 'border-red-300' : 'border-gray-300'
              }`}
              aria-describedby={errors.kids ? 'kids-error' : undefined}
            />
            {errors.kids && (
              <div id="kids-error" className="text-xs text-red-600 mt-1">
                {errors.kids}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Dietary Preferences
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggleDietaryPref(option)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                profile.dietaryPrefs.includes(option)
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
              aria-pressed={profile.dietaryPrefs.includes(option)}
            >
              {option}
            </button>
          ))}
        </div>
        {errors.dietaryPrefs && (
          <div className="text-xs text-red-600 mt-2">
            {errors.dietaryPrefs}
          </div>
        )}
      </div>

      {/* Cooking Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Available Cooking Time
        </label>
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
                onChange={(e) => onProfileChange({ timeAvailable: e.target.value })}
                className="sr-only"
              />
              <span className="text-xl mr-3" role="img" aria-label={time.label}>
                {time.icon}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{time.label}</div>
                <div className="text-xs text-gray-600">{time.desc}</div>
              </div>
            </label>
          ))}
        </div>
        {errors.timeAvailable && (
          <div className="text-xs text-red-600 mt-2">
            {errors.timeAvailable}
          </div>
        )}
      </div>

      {/* Cooking Experience */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Cooking Experience
        </label>
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
              onChange={(e) => onProfileChange({ cookingLevel: e.target.value })}
              className="sr-only"
            />
            <ChefHat className={`h-5 w-5 mr-4 ${
              profile.cookingLevel === level.value ? 'text-gray-700' : 'text-gray-400'
            }`} />
            <div className="flex-1">
              <div className="font-medium text-gray-900">{level.label}</div>
              <div className="text-sm text-gray-600">{level.desc}</div>
            </div>
          </label>
        ))}
        {errors.cookingLevel && (
          <div className="text-xs text-red-600 mt-2">
            {errors.cookingLevel}
          </div>
        )}
      </div>

      {/* Available Ingredients */}
      <div>
        <label 
          htmlFor="ingredients-input"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Ingredients on Hand
        </label>
        <textarea
          id="ingredients-input"
          placeholder="What ingredients do you have? (optional)"
          value={profile.ingredients}
          onChange={(e) => onProfileChange({ ingredients: e.target.value })}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-base text-gray-900 resize-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none placeholder-gray-500 ${
            errors.ingredients ? 'border-red-300' : 'border-gray-300'
          }`}
          rows={3}
          aria-describedby={errors.ingredients ? 'ingredients-error' : 'ingredients-help'}
        />
        <div id="ingredients-help" className="text-xs text-gray-500 mt-1">
          List any ingredients you have on hand, separated by commas
        </div>
        {errors.ingredients && (
          <div id="ingredients-error" className="text-xs text-red-600 mt-1">
            {errors.ingredients}
          </div>
        )}
      </div>
    </div>
  );
}

// Export configuration data for use in other components
export { DIETARY_OPTIONS, TIME_OPTIONS, COOKING_LEVELS };