import React from 'react';
import { ArrowRight, Utensils, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface ToolsSectionProps {
  onNavigateToTool: (tool: string) => void;
}

export const ToolsSection: React.FC<ToolsSectionProps> = ({ onNavigateToTool }) => {
  return (
    <section id="tools" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Cooking Situation</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every family dinner crisis has a solution. Pick your tool based on what you need right now.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Single Recipe Tool */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tonight's Dinner Crisis</h3>
              <p className="text-gray-700 text-lg mb-6">
                It's 5pm, the kids are hungry, and you're staring into the fridge wondering what's possible.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>"Protein + random stuff" recipes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Stretch small portions for unexpected guests</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>One-pot solutions for minimal cleanup</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Recipes that work as tomorrow's lunch</span>
                </div>
              </div>

              <Button 
                onClick={() => onNavigateToTool('/recipe')}
                variant="primary"
                fullWidth
                className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all flex items-center justify-center"
              >
                <span>Solve Tonight's Dinner</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Weekly Planning Tool */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">This Week's Meal Plan</h3>
              <p className="text-gray-700 text-lg mb-6">
                Sunday planning session that sets you up for weeknight success. One session, five dinners solved.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Complete weekly meal plans</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Organized shopping lists with prices</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Sunday prep schedules</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Budget-focused or time-saving plans</span>
                </div>
              </div>

              <Button 
                onClick={() => onNavigateToTool('/weekly-plan')}
                variant="primary"
                fullWidth
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center"
              >
                <span>Plan My Week</span>
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};