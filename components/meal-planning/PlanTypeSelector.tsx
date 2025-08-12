import React from 'react';
import { PLAN_TYPES } from '../../utils/constants';

interface PlanTypeSelectorProps {
  selectedPlanType: string;
  onPlanTypeChange: (planType: string) => void;
}

export function PlanTypeSelector({ selectedPlanType, onPlanTypeChange }: PlanTypeSelectorProps) {
  const handlePlanTypeSelection = (planTypeValue: string) => {
    onPlanTypeChange(planTypeValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Choose Your Planning Style
      </label>
      <div className="grid grid-cols-1 gap-3">
        {PLAN_TYPES.map(planType => (
          <label
            key={planType.value}
            className={`flex items-start p-4 rounded-xl cursor-pointer border transition-all ${
              selectedPlanType === planType.value
                ? 'bg-blue-50 border-blue-600'
                : 'bg-gray-50 border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="planType"
              value={planType.value}
              checked={selectedPlanType === planType.value}
              onChange={(e) => handlePlanTypeSelection(e.target.value)}
              className="sr-only"
            />
            <span className="text-2xl mr-4 mt-1">{planType.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-900 text-sm">{planType.label}</div>
              <div className="text-xs text-blue-600 mb-1">{planType.subtitle}</div>
              <div className="text-xs text-gray-500">{planType.description}</div>
            </div>
          </label>
        ))}
      </div>
      
      {/* Link to Weekly Meal Planning */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-900">Need Weekly Meal Planning?</div>
            <div className="text-xs text-blue-700">Plan multiple meals with shopping lists</div>
          </div>
          <span className="text-2xl">📅</span>
        </div>
        <div className="text-xs text-blue-600 mt-2">
          Coming soon: Weekly meal planner with budget tracking
        </div>
      </div>
    </div>
  );
}