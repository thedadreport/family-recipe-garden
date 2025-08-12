// Meal plan storage service for managing saved meal plans in localStorage

// Interfaces matching existing component structure
interface DayMeal {
  day: string;
  title: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  instructions?: string[];
  tips?: string[];
  prepAhead?: string[];
  isExpanded?: boolean;
}

interface ShoppingItem {
  item: string;
  quantity: string;
  estimatedCost?: string;
}

interface ShoppingSection {
  section: string;
  items: ShoppingItem[];
}

interface PrepTask {
  day: string;
  tasks: string[];
  timeNeeded: string;
}

interface MealPlan {
  id: number;
  planType: string;
  meals: DayMeal[];
  shoppingList: ShoppingSection[];
  totalCost?: string;
  prepSchedule?: PrepTask[];
  notes: string;
  createdAt?: Date;
}

// Meal plan search/filter criteria
interface PlanFilters {
  planType?: string;
  searchTerm?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasPrepSchedule?: boolean;
  budgetRange?: {
    min: number;
    max: number;
  };
}

// Meal plan statistics
interface PlanStats {
  totalPlans: number;
  plansByType: Record<string, number>;
  averageCost: number;
  totalMealsPlanned: number;
  mostUsedIngredients: Array<{ item: string; count: number }>;
}

const PLANS_STORAGE_KEY = 'saved-meal-plans';
const MAX_PLANS = 500; // Prevent localStorage from getting too large

class PlanStorageService {
  // Get all meal plans from storage
  getAllPlans(): MealPlan[] {
    try {
      const stored = localStorage.getItem(PLANS_STORAGE_KEY);
      if (!stored) return [];
      
      const plans = JSON.parse(stored) as MealPlan[];
      
      // Convert createdAt back to Date objects
      return plans.map(plan => ({
        ...plan,
        createdAt: plan.createdAt ? new Date(plan.createdAt) : undefined
      }));
    } catch (error) {
      console.error('Error loading meal plans from storage:', error);
      return [];
    }
  }

  // Save single meal plan
  savePlan(plan: MealPlan): boolean {
    try {
      const plans = this.getAllPlans();
      
      // Check if plan already exists (by ID)
      const existingIndex = plans.findIndex(p => p.id === plan.id);
      
      if (existingIndex >= 0) {
        // Update existing plan
        plans[existingIndex] = {
          ...plan,
          createdAt: plan.createdAt || new Date()
        };
      } else {
        // Add new plan
        if (plans.length >= MAX_PLANS) {
          console.warn(`Maximum number of meal plans (${MAX_PLANS}) reached`);
          return false;
        }
        
        plans.push({
          ...plan,
          createdAt: plan.createdAt || new Date()
        });
      }
      
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
      return true;
    } catch (error) {
      console.error('Error saving meal plan to storage:', error);
      return false;
    }
  }

  // Save multiple meal plans
  savePlans(plans: MealPlan[]): boolean {
    try {
      const existingPlans = this.getAllPlans();
      
      plans.forEach(plan => {
        const existingIndex = existingPlans.findIndex(p => p.id === plan.id);
        
        if (existingIndex >= 0) {
          existingPlans[existingIndex] = {
            ...plan,
            createdAt: plan.createdAt || new Date()
          };
        } else {
          if (existingPlans.length < MAX_PLANS) {
            existingPlans.push({
              ...plan,
              createdAt: plan.createdAt || new Date()
            });
          }
        }
      });
      
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(existingPlans));
      return true;
    } catch (error) {
      console.error('Error saving meal plans to storage:', error);
      return false;
    }
  }

  // Get meal plan by ID
  getPlanById(id: number): MealPlan | null {
    const plans = this.getAllPlans();
    return plans.find(plan => plan.id === id) || null;
  }

  // Delete meal plan by ID
  deletePlan(id: number): boolean {
    try {
      const plans = this.getAllPlans();
      const filteredPlans = plans.filter(plan => plan.id !== id);
      
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(filteredPlans));
      return true;
    } catch (error) {
      console.error('Error deleting meal plan from storage:', error);
      return false;
    }
  }

  // Search/filter meal plans
  searchPlans(filters: PlanFilters): MealPlan[] {
    const plans = this.getAllPlans();
    
    return plans.filter(plan => {
      // Search term filter (searches meals, notes)
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchableText = [
          plan.notes,
          ...plan.meals.map(meal => `${meal.title} ${meal.description}`),
          ...(plan.shoppingList?.flatMap(section => 
            section.items.map(item => item.item)
          ) || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      // Plan type filter
      if (filters.planType && plan.planType !== filters.planType) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange && plan.createdAt) {
        const planDate = new Date(plan.createdAt);
        if (planDate < filters.dateRange.start || planDate > filters.dateRange.end) {
          return false;
        }
      }
      
      // Prep schedule filter
      if (filters.hasPrepSchedule !== undefined) {
        const hasPrepSchedule = !!(plan.prepSchedule && plan.prepSchedule.length > 0);
        if (hasPrepSchedule !== filters.hasPrepSchedule) {
          return false;
        }
      }
      
      // Budget range filter
      if (filters.budgetRange && plan.totalCost) {
        const cost = parseFloat(plan.totalCost.replace(/[$,]/g, ''));
        if (!isNaN(cost)) {
          if (cost < filters.budgetRange.min || cost > filters.budgetRange.max) {
            return false;
          }
        }
      }
      
      return true;
    });
  }

  // Get plans by type
  getPlansByType(planType: string): MealPlan[] {
    return this.getAllPlans().filter(plan => plan.planType === planType);
  }

  // Get recent meal plans (last N plans)
  getRecentPlans(limit: number = 10): MealPlan[] {
    const plans = this.getAllPlans();
    return plans
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  // Get shopping list from a meal plan
  getShoppingList(planId: number): ShoppingSection[] {
    const plan = this.getPlanById(planId);
    return plan?.shoppingList || [];
  }

  // Get prep schedule from a meal plan
  getPrepSchedule(planId: number): PrepTask[] {
    const plan = this.getPlanById(planId);
    return plan?.prepSchedule || [];
  }

  // Extract all unique ingredients across all plans
  getAllIngredients(): Array<{ item: string; count: number }> {
    const plans = this.getAllPlans();
    const ingredientCounts: Record<string, number> = {};
    
    plans.forEach(plan => {
      plan.shoppingList?.forEach(section => {
        section.items.forEach(item => {
          const itemName = item.item.toLowerCase();
          ingredientCounts[itemName] = (ingredientCounts[itemName] || 0) + 1;
        });
      });
    });
    
    return Object.entries(ingredientCounts)
      .map(([item, count]) => ({ item, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Get meal plan statistics
  getPlanStats(): PlanStats {
    const plans = this.getAllPlans();
    
    const stats: PlanStats = {
      totalPlans: plans.length,
      plansByType: {},
      averageCost: 0,
      totalMealsPlanned: 0,
      mostUsedIngredients: []
    };
    
    let totalCosts = 0;
    let costsCount = 0;
    
    plans.forEach(plan => {
      // Count by plan type
      stats.plansByType[plan.planType] = (stats.plansByType[plan.planType] || 0) + 1;
      
      // Count total meals
      stats.totalMealsPlanned += plan.meals.length;
      
      // Calculate average cost
      if (plan.totalCost) {
        const cost = parseFloat(plan.totalCost.replace(/[$,]/g, ''));
        if (!isNaN(cost)) {
          totalCosts += cost;
          costsCount++;
        }
      }
    });
    
    stats.averageCost = costsCount > 0 ? totalCosts / costsCount : 0;
    stats.mostUsedIngredients = this.getAllIngredients().slice(0, 20);
    
    return stats;
  }

  // Generate shopping list for multiple plans (useful for bulk planning)
  generateCombinedShoppingList(planIds: number[]): ShoppingSection[] {
    const combinedItems: Record<string, { items: ShoppingItem[], section: string }> = {};
    
    planIds.forEach(planId => {
      const plan = this.getPlanById(planId);
      if (plan?.shoppingList) {
        plan.shoppingList.forEach(section => {
          if (!combinedItems[section.section]) {
            combinedItems[section.section] = { items: [], section: section.section };
          }
          
          section.items.forEach(item => {
            // Check if item already exists, if so combine quantities
            const existingItem = combinedItems[section.section].items.find(
              existing => existing.item.toLowerCase() === item.item.toLowerCase()
            );
            
            if (existingItem) {
              // Combine quantities (simple concatenation for now)
              existingItem.quantity += `, ${item.quantity}`;
            } else {
              combinedItems[section.section].items.push({ ...item });
            }
          });
        });
      }
    });
    
    return Object.values(combinedItems).map(combined => ({
      section: combined.section,
      items: combined.items
    }));
  }

  // Export meal plans (for backup/sharing)
  exportPlans(): string {
    const plans = this.getAllPlans();
    return JSON.stringify(plans, null, 2);
  }

  // Import meal plans (from backup/sharing)
  importPlans(plansJson: string, mergeMode: 'replace' | 'merge' = 'merge'): boolean {
    try {
      const importedPlans = JSON.parse(plansJson) as MealPlan[];
      
      // Validate imported plans
      if (!Array.isArray(importedPlans)) {
        throw new Error('Invalid meal plans format');
      }
      
      if (mergeMode === 'replace') {
        // Replace all existing plans
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(importedPlans));
      } else {
        // Merge with existing plans
        const existingPlans = this.getAllPlans();
        const mergedPlans = [...existingPlans];
        
        importedPlans.forEach(importedPlan => {
          const existingIndex = mergedPlans.findIndex(p => p.id === importedPlan.id);
          if (existingIndex >= 0) {
            // Update existing plan
            mergedPlans[existingIndex] = importedPlan;
          } else {
            // Add new plan
            mergedPlans.push(importedPlan);
          }
        });
        
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(mergedPlans));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing meal plans:', error);
      return false;
    }
  }

  // Clear all meal plans
  clearAllPlans(): boolean {
    try {
      localStorage.removeItem(PLANS_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing meal plans from storage:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): {
    planCount: number;
    storageSize: number;
    maxPlans: number;
    percentageUsed: number;
  } {
    const plans = this.getAllPlans();
    const storageData = localStorage.getItem(PLANS_STORAGE_KEY) || '';
    
    return {
      planCount: plans.length,
      storageSize: storageData.length,
      maxPlans: MAX_PLANS,
      percentageUsed: (plans.length / MAX_PLANS) * 100
    };
  }

  // Archive old meal plans (move plans older than X days to archive)
  archiveOldPlans(daysOld: number = 90): number {
    try {
      const plans = this.getAllPlans();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const currentPlans = plans.filter(plan => {
        if (!plan.createdAt) return true;
        return new Date(plan.createdAt) > cutoffDate;
      });
      
      const archivedCount = plans.length - currentPlans.length;
      
      if (archivedCount > 0) {
        localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(currentPlans));
      }
      
      return archivedCount;
    } catch (error) {
      console.error('Error archiving old meal plans:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const planStorage = new PlanStorageService();