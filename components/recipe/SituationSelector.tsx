import React from 'react';

// Situation option interface
interface SituationOption {
  value: string;
  label: string;
  description: string;
  icon: string;
  subtitle: string;
}

// Component props
interface SituationSelectorProps {
  selectedSituation: string;
  onSituationChange: (situation: string) => void;
  className?: string;
}

// Situation options data (matches existing component structure)
const SITUATION_OPTIONS: SituationOption[] = [
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

export default function SituationSelector({
  selectedSituation,
  onSituationChange,
  className = ''
}: SituationSelectorProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Your Cooking Situation
        </label>
        <div className="grid grid-cols-1 gap-3">
          {SITUATION_OPTIONS.map(situation => (
            <label
              key={situation.value}
              className={`flex items-start p-4 rounded-xl cursor-pointer border transition-all ${
                selectedSituation === situation.value
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-gray-50 border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="situation"
                value={situation.value}
                checked={selectedSituation === situation.value}
                onChange={(e) => onSituationChange(e.target.value)}
                className="sr-only"
                aria-describedby={`situation-${situation.value}-description`}
              />
              <span className="text-2xl mr-4 mt-1" role="img" aria-label={situation.label}>
                {situation.icon}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">
                  {situation.label}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {situation.subtitle}
                </div>
                <div 
                  className="text-xs text-gray-500"
                  id={`situation-${situation.value}-description`}
                >
                  {situation.description}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      {/* Weekly Meal Planning Callout */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">
              Need Weekly Meal Planning?
            </div>
            <div className="text-xs text-blue-700">
              Plan multiple meals with shopping lists
            </div>
          </div>
          <span className="text-2xl" role="img" aria-label="Calendar">
            📅
          </span>
        </div>
        <div className="text-xs text-blue-600 mt-2">
          Coming soon: Weekly meal planner with budget tracking
        </div>
      </div>
    </div>
  );
}

// Export situation options for use in other components
export { SITUATION_OPTIONS };
export type { SituationOption };