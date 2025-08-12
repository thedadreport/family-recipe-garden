import React from 'react';
import { ArrowRight, ChefHat, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onNavigateToTool: (tool: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToTool }) => {
  return (
    <section className="pt-20 pb-32 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Recipe Solutions
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Turn Dinner Stress Into
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> Family Joy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI-powered recipes that solve real dinner problems. From "what's in my fridge?" to "plan my whole week" - 
            we've got the recipe for every family situation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button 
            onClick={() => onNavigateToTool('/recipe')}
            variant="primary"
            size="lg"
            icon={<ChefHat className="h-5 w-5" />}
            className="px-8 py-4 text-lg"
          >
            Generate Recipe Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            onClick={() => onNavigateToTool('/weekly-plan')}
            variant="secondary"
            size="lg"
            icon={<Calendar className="h-5 w-5" />}
            className="px-8 py-4 text-lg"
          >
            Plan My Week
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">30 sec</div>
            <div className="text-gray-600">To get your recipe</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">6 situations</div>
            <div className="text-gray-600">Real dinner problems solved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">∞</div>
            <div className="text-gray-600">Family-tested recipes</div>
          </div>
        </div>
      </div>
    </section>
  );
};