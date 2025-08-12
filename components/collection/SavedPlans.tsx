import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { MealPlan } from '../../types/mealPlan';
import { Button } from '../common/Button';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

// Rest of the component stays the same...

interface SavedPlansProps {
  savedPlans: MealPlan[];
  onViewPlan: (plan: MealPlan) => void;
  onCreateNewPlan: () => void;
}

export default function SavedPlans({
  savedPlans,
  onViewPlan,
  onCreateNewPlan
}: SavedPlansProps) {
  const [filter, setFilter] = useState<'all' | 'budget' | 'time-saving'>('all');
  const [loading, setLoading] = useState<boolean>(false);

  // Filter plans based on selected filter
  const filteredPlans = filter === 'all' 
    ? savedPlans
    : savedPlans.filter(plan => plan.planType === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">Saved Meal Plans</h1>
            <p className="text-gray-600 text-lg">Your collection of weekly meal plans</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'all' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                All Plans
              </button>
              <button
                onClick={() => setFilter('budget')}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'budget' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Budget
              </button>
              <button
                onClick={() => setFilter('time-saving')}
                className={`px-4 py-2 text-sm font-medium ${
                  filter === 'time-saving' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Time-Saving
              </button>
            </div>
            <Button
              onClick={onCreateNewPlan}
              variant="primary"
              icon={<Calendar className="h-5 w-5" />}
            >
              Create New Plan
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">No saved plans yet</h2>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Create your first weekly meal plan to get started'
                  : `No ${filter === 'budget' ? 'budget' : 'time-saving'} plans found`}
              </p>
              {filter !== 'all' && savedPlans.length > 0 && (
                <Button
                  onClick={() => setFilter('all')}
                  variant="secondary"
                  className="mt-4"
                >
                  View All Plans
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan.planType === 'budget' && 'Budget Plan'}
                        {plan.planType === 'time-saving' && 'Time-Saving Plan'}
                        {plan.planType === 'general' && 'Weekly Plan'}
                      </h3>
                      <p className="text-sm text-gray-600">{plan.meals.length} meals planned</p>
                    </div>
                    {plan.totalCost && (
                      <div className="text-lg font-semibold text-green-600">
                        {plan.totalCost}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {plan.meals.slice(0, 3).map((meal, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        <span className="font-medium">{meal.day}:</span> {meal.title}
                      </div>
                    ))}
                    {plan.meals.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{plan.meals.length - 3} more meals
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => onViewPlan(plan)}
                    variant="secondary"
                    fullWidth
                  >
                    View Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}