import React from 'react';
import { Button } from '../common/Button';
import { HeroSection } from './HeroSection';
import { ToolsSection } from './ToolsSection';
import { TestimonialSection } from './TestimonialSection';
import { ChefHat, Calendar, Users, Sparkles, Heart } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToTool = (tool: string) => {
    // In actual Next.js app, this would be router.push()
    console.log(`Navigate to ${tool}`);
    // Example: router.push(tool);
  };
  
  // Placeholder testimonials
  const testimonials = [
    {
      text: "The 'protein + random stuff' situation is my life! This actually gave me a recipe I could make with what I had.",
      author: "Sarah M., Mom of 3",
      stars: 5
    },
    {
      text: "Weekly planning used to stress me out. Now I spend 20 minutes on Sunday and I'm set for the week.",
      author: "Mike T., Dad of 2",
      stars: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Family Recipe Garden</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('tools')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tools
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <Button 
                onClick={() => navigateToTool('/recipe')}
                variant="primary"
                size="sm"
              >
                Try Free
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onNavigateToTool={navigateToTool} />

      {/* Tools Section */}
      <ToolsSection onNavigateToTool={navigateToTool} />

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspired by the best home cooks - Ina Garten's confidence, Alice Waters' seasonal focus, 
              and real family cooking wisdom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tell Us Your Situation</h3>
              <p className="text-gray-600 leading-relaxed">
                Family size, what's in your fridge, how much time you have, and what cooking situation you're facing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Creates Your Recipe</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI, trained on the philosophy of great home cooks, creates recipes that solve your specific dinner problem.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cook & Make It Yours</h3>
              <p className="text-gray-600 leading-relaxed">
                Save recipes, add your own notes, and edit them based on what worked for your family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Solve Tonight's Dinner?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Stop stressing about what's for dinner. Start with one recipe or plan your whole week - 
            both tools are free to try.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigateToTool('/recipe')}
              variant="secondary"
              size="lg"
              icon={<ChefHat className="h-5 w-5" />}
              className="px-8 py-4 text-lg bg-white text-gray-900"
            >
              Try Recipe Generator
            </Button>
            <Button 
              onClick={() => navigateToTool('/weekly-plan')}
              variant="outline"
              size="lg"
              icon={<Calendar className="h-5 w-5" />}
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-gray-900"
            >
              Plan My Week
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
              <span className="text-xl font-semibold text-white">Family Recipe Garden</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2025 Family Recipe Garden. Made with ❤️ for busy families.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};