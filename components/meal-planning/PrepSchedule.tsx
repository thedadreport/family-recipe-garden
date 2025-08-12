import React from 'react';
import { Clock, Calendar, CheckSquare } from 'lucide-react';
import { PrepTask } from '../../types/mealPlan';

interface PrepScheduleProps {
  prepSchedule: PrepTask[];
}

export function PrepSchedule({ prepSchedule }: PrepScheduleProps) {
  const getDayIcon = (day: string) => {
    const dayLower = day.toLowerCase();
    if (dayLower.includes('sunday')) return '📅';
    if (dayLower.includes('monday')) return '🌅';
    if (dayLower.includes('tuesday')) return '⭐';
    if (dayLower.includes('wednesday')) return '🍯';
    if (dayLower.includes('thursday')) return '🌟';
    if (dayLower.includes('friday')) return '🎉';
    if (dayLower.includes('saturday')) return '🌈';
    return '📋';
  };

  const getDayColor = (day: string, index: number) => {
    const dayLower = day.toLowerCase();
    if (dayLower.includes('sunday')) return 'bg-blue-50 border-blue-200 text-blue-900';
    if (dayLower.includes('monday')) return 'bg-green-50 border-green-200 text-green-900';
    if (dayLower.includes('tuesday')) return 'bg-purple-50 border-purple-200 text-purple-900';
    if (dayLower.includes('wednesday')) return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    if (dayLower.includes('thursday')) return 'bg-pink-50 border-pink-200 text-pink-900';
    if (dayLower.includes('friday')) return 'bg-indigo-50 border-indigo-200 text-indigo-900';
    if (dayLower.includes('saturday')) return 'bg-orange-50 border-orange-200 text-orange-900';
    
    // Fallback colors based on index
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-900',
      'bg-green-50 border-green-200 text-green-900',
      'bg-purple-50 border-purple-200 text-purple-900',
      'bg-yellow-50 border-yellow-200 text-yellow-900'
    ];
    return colors[index % colors.length];
  };

  const getTotalTime = () => {
    const totalMinutes = prepSchedule.reduce((total, prep) => {
      const timeMatch = prep.timeNeeded.match(/(\d+)\s*min/i);
      return total + (timeMatch ? parseInt(timeMatch[1]) : 0);
    }, 0);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${totalMinutes}m`;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-3 text-blue-600" />
          Prep Schedule
        </h3>
        <div className="text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          Total: {getTotalTime()}
        </div>
      </div>

      {/* Schedule Items */}
      <div className="space-y-4">
        {prepSchedule.map((prep, index) => (
          <div 
            key={index} 
            className={`rounded-lg p-4 border-2 ${getDayColor(prep.day, index)}`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getDayIcon(prep.day)}</span>
                <h4 className="font-semibold text-gray-900 text-base">{prep.day}</h4>
              </div>
              <div className="flex items-center space-x-2 text-sm font-medium text-blue-600">
                <Clock className="h-4 w-4" />
                <span>{prep.timeNeeded}</span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {prep.tasks.map((task, taskIndex) => (
                <div 
                  key={taskIndex} 
                  className="flex items-start space-x-3 bg-white/70 rounded-lg p-3 border border-white/50"
                >
                  <div className="flex-shrink-0 mt-1">
                    <CheckSquare className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed flex-1">{task}</p>
                </div>
              ))}
            </div>

            {/* Task Count */}
            <div className="mt-3 text-xs text-gray-600 flex items-center justify-end">
              <Calendar className="h-3 w-3 mr-1" />
              {prep.tasks.length} task{prep.tasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tips */}
      <div className="mt-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-medium text-blue-900 text-sm mb-1">Prep Schedule Tips</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Check off tasks as you complete them</li>
              <li>• Prep ingredients can be stored in labeled containers</li>
              <li>• Most chopped vegetables stay fresh for 2-3 days</li>
              <li>• Marinated proteins can often be done a day ahead</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}