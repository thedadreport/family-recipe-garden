import React from 'react';
import { ArrowLeft, Calendar, Clock, Users, DollarSign, Plus, ShoppingCart, CheckCircle, Copy } from 'lucide-react';
import { MealPlan, WeeklyProfile, DayMeal, ShoppingSection, PrepTask } from '../../types/mealPlan';
import { Button } from '../common/Button';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
  weeklyProfile: WeeklyProfile;
  onBackToPlanning: () => void;
  onNavigateToCollection?: () => void;
  onSavePlan: (plan: MealPlan) => void;
  onExpandMeal: (mealIndex: number) => void;
  expandingMealIndex: number | null;
  savedPlansCount?: number;
}

export function MealPlanDisplay({
  mealPlan,
  weeklyProfile,
  onBackToPlanning,
  onNavigateToCollection,
  onSavePlan,
  onExpandMeal,
  expandingMealIndex,
  savedPlansCount = 0
}: MealPlanDisplayProps) {
  const getPlanTypeTitle = (planType: string) => {
    const titles = {
      'general': 'Your Weekly Meal Plan',
      'budget': 'Your Weekly Meal Plan - Budget Focus',
      'time-saving': 'Your Weekly Meal Plan - Time-Saving Focus'
    };
    return titles[planType as keyof typeof titles] || 'Your Weekly Meal Plan';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={onBackToPlanning}
                icon={<ArrowLeft className="h-4 w-4" />}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
              >
                New Plan
              </Button>
              
              {onNavigateToCollection && (
                <Button
                  variant="ghost"
                  onClick={onNavigateToCollection}
                  icon={<Calendar className="h-4 w-4" />}
                  className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20"
                >
                  Saved Plans ({savedPlansCount})
                </Button>
              )}
            </div>
            
            <h1 className="text-3xl font-semibold mb-3 tracking-tight">
              {getPlanTypeTitle(mealPlan.planType)}
            </h1>
            
            <div className="flex items-center space-x-6 text-white/90 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{weeklyProfile.adults} adults, {weeklyProfile.kids} kids</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{weeklyProfile.weeknightTimeLimit} min max</span>
              </div>
              {mealPlan.totalCost && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>{mealPlan.totalCost}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex space-x-3 mb-8">
              <Button
                variant="primary"
                onClick={() => onSavePlan(mealPlan)}
              >
                Save Plan
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Main Content - Meals */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
                  This Week's Meals
                </h2>
                <div className="space-y-4">
                  {mealPlan.meals.map((meal, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {meal.day ? meal.day.slice(0, 1) : index + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{meal.title}</h3>
                              <p className="text-sm text-blue-600">{meal.day}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => onExpandMeal(index)}
                            disabled={expandingMealIndex === index}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center space-x-2 disabled:opacity-50"
                          >
                            {expandingMealIndex === index ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4" />
                                <span>Get Recipe</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{meal.description}</p>
                        
                        {/* Expanded meal content would go here when implemented */}
                        {meal.isExpanded && meal.ingredients && (
                          <div className="border-t border-gray-300 pt-6 mt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
                                <div className="space-y-2">
                                  {meal.ingredients.map((ingredient, i) => (
                                    <div key={i} className="flex items-start space-x-2 text-sm">
                                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                      <span className="text-gray-800">{ingredient}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {meal.instructions && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                                  <div className="space-y-2">
                                    {meal.instructions.map((instruction, i) => (
                                      <div key={i} className="flex space-x-2">
                                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
                                          {i + 1}
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed">{instruction}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                
                {/* Shopping List */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <ShoppingCart className="h-5 w-5 mr-3 text-green-600" />
                      Shopping List
                    </h3>
                    {mealPlan.totalCost && (
                      <div className="text-lg font-semibold text-green-600">
                        {mealPlan.totalCost}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {mealPlan.shoppingList.map((section, index) => (
                      <div key={index}>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm uppercase tracking-wide">
                          {section.section}
                        </h4>
                        <div className="space-y-1">
                          {section.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm bg-white rounded-lg px-3 py-2">
                              <div>
                                <span className="text-gray-900">{item.item}</span>
                                <span className="text-gray-500 ml-2">({item.quantity})</span>
                              </div>
                              {item.estimatedCost && (
                                <span className="text-green-600 font-medium">{item.estimatedCost}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prep Schedule */}
                {mealPlan.prepSchedule && mealPlan.prepSchedule.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-3 text-blue-600" />
                      Prep Schedule
                    </h3>
                    <div className="space-y-4">
                      {mealPlan.prepSchedule.map((prep, index) => (
                        <div key={index} className="bg-white rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium text-gray-900">{prep.day}</h4>
                            <span className="text-sm text-blue-600">{prep.timeNeeded}</span>
                          </div>
                          <div className="space-y-1">
                            {prep.tasks.map((task, i) => (
                              <p key={i} className="text-sm text-gray-700">• {task}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chef's Notes */}
                {mealPlan.notes && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Chef's Notes</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{mealPlan.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}