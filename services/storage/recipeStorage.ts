// Recipe storage service for managing saved recipes in localStorage

// Recipe interface (matching existing component structure)
interface Recipe {
  id: number;
  title: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  notes: string;
  isFavorite: boolean;
  situation?: string;
  cookingMethod?: string;
  seasonal?: boolean;
  cuisine?: string;
  mealType?: string;
  createdAt?: Date;
}

// Recipe search/filter criteria
interface RecipeFilters {
  situation?: string;
  cuisine?: string;
  mealType?: string;
  cookingMethod?: string;
  isFavorite?: boolean;
  seasonal?: boolean;
  searchTerm?: string;
}

// Recipe statistics
interface RecipeStats {
  totalRecipes: number;
  favoriteCount: number;
  recipesBySituation: Record<string, number>;
  recipesByCuisine: Record<string, number>;
  recipesByMealType: Record<string, number>;
}

const RECIPES_STORAGE_KEY = 'saved-recipes';
const MAX_RECIPES = 1000; // Prevent localStorage from getting too large

class RecipeStorageService {
  // Get all recipes from storage
  getAllRecipes(): Recipe[] {
    try {
      const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
      if (!stored) return [];
      
      const recipes = JSON.parse(stored) as Recipe[];
      
      // Convert createdAt back to Date objects
      return recipes.map(recipe => ({
        ...recipe,
        createdAt: recipe.createdAt ? new Date(recipe.createdAt) : undefined
      }));
    } catch (error) {
      console.error('Error loading recipes from storage:', error);
      return [];
    }
  }

  // Save single recipe
  saveRecipe(recipe: Recipe): boolean {
    try {
      const recipes = this.getAllRecipes();
      
      // Check if recipe already exists (by ID)
      const existingIndex = recipes.findIndex(r => r.id === recipe.id);
      
      if (existingIndex >= 0) {
        // Update existing recipe
        recipes[existingIndex] = {
          ...recipe,
          createdAt: recipe.createdAt || new Date()
        };
      } else {
        // Add new recipe
        if (recipes.length >= MAX_RECIPES) {
          console.warn(`Maximum number of recipes (${MAX_RECIPES}) reached`);
          return false;
        }
        
        recipes.push({
          ...recipe,
          createdAt: recipe.createdAt || new Date()
        });
      }
      
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
      return true;
    } catch (error) {
      console.error('Error saving recipe to storage:', error);
      return false;
    }
  }

  // Save multiple recipes
  saveRecipes(recipes: Recipe[]): boolean {
    try {
      const existingRecipes = this.getAllRecipes();
      
      recipes.forEach(recipe => {
        const existingIndex = existingRecipes.findIndex(r => r.id === recipe.id);
        
        if (existingIndex >= 0) {
          existingRecipes[existingIndex] = {
            ...recipe,
            createdAt: recipe.createdAt || new Date()
          };
        } else {
          if (existingRecipes.length < MAX_RECIPES) {
            existingRecipes.push({
              ...recipe,
              createdAt: recipe.createdAt || new Date()
            });
          }
        }
      });
      
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(existingRecipes));
      return true;
    } catch (error) {
      console.error('Error saving recipes to storage:', error);
      return false;
    }
  }

  // Get recipe by ID
  getRecipeById(id: number): Recipe | null {
    const recipes = this.getAllRecipes();
    return recipes.find(recipe => recipe.id === id) || null;
  }

  // Delete recipe by ID
  deleteRecipe(id: number): boolean {
    try {
      const recipes = this.getAllRecipes();
      const filteredRecipes = recipes.filter(recipe => recipe.id !== id);
      
      localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(filteredRecipes));
      return true;
    } catch (error) {
      console.error('Error deleting recipe from storage:', error);
      return false;
    }
  }

  // Toggle favorite status
  toggleFavorite(id: number): boolean {
    try {
      const recipes = this.getAllRecipes();
      const recipeIndex = recipes.findIndex(recipe => recipe.id === id);
      
      if (recipeIndex >= 0) {
        recipes[recipeIndex].isFavorite = !recipes[recipeIndex].isFavorite;
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(recipes));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      return false;
    }
  }

  // Get favorite recipes
  getFavoriteRecipes(): Recipe[] {
    return this.getAllRecipes().filter(recipe => recipe.isFavorite);
  }

  // Search/filter recipes
  searchRecipes(filters: RecipeFilters): Recipe[] {
    const recipes = this.getAllRecipes();
    
    return recipes.filter(recipe => {
      // Search term filter (searches title, ingredients, notes)
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const searchableText = [
          recipe.title,
          recipe.notes,
          ...recipe.ingredients,
          ...recipe.instructions
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }
      
      // Situation filter
      if (filters.situation && recipe.situation !== filters.situation) {
        return false;
      }
      
      // Cuisine filter
      if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
        return false;
      }
      
      // Meal type filter
      if (filters.mealType && recipe.mealType !== filters.mealType) {
        return false;
      }
      
      // Cooking method filter
      if (filters.cookingMethod && recipe.cookingMethod !== filters.cookingMethod) {
        return false;
      }
      
      // Favorite filter
      if (filters.isFavorite !== undefined && recipe.isFavorite !== filters.isFavorite) {
        return false;
      }
      
      // Seasonal filter
      if (filters.seasonal !== undefined && recipe.seasonal !== filters.seasonal) {
        return false;
      }
      
      return true;
    });
  }

  // Get recipes by situation
  getRecipesBySituation(situation: string): Recipe[] {
    return this.getAllRecipes().filter(recipe => recipe.situation === situation);
  }

  // Get recipes by cuisine
  getRecipesByCuisine(cuisine: string): Recipe[] {
    return this.getAllRecipes().filter(recipe => recipe.cuisine === cuisine);
  }

  // Get recent recipes (last N recipes)
  getRecentRecipes(limit: number = 10): Recipe[] {
    const recipes = this.getAllRecipes();
    return recipes
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }

  // Get recipe statistics
  getRecipeStats(): RecipeStats {
    const recipes = this.getAllRecipes();
    
    const stats: RecipeStats = {
      totalRecipes: recipes.length,
      favoriteCount: recipes.filter(r => r.isFavorite).length,
      recipesBySituation: {},
      recipesByCuisine: {},
      recipesByMealType: {}
    };
    
    recipes.forEach(recipe => {
      // Count by situation
      if (recipe.situation) {
        stats.recipesBySituation[recipe.situation] = (stats.recipesBySituation[recipe.situation] || 0) + 1;
      }
      
      // Count by cuisine
      if (recipe.cuisine) {
        stats.recipesByCuisine[recipe.cuisine] = (stats.recipesByCuisine[recipe.cuisine] || 0) + 1;
      }
      
      // Count by meal type
      if (recipe.mealType) {
        stats.recipesByMealType[recipe.mealType] = (stats.recipesByMealType[recipe.mealType] || 0) + 1;
      }
    });
    
    return stats;
  }

  // Export recipes (for backup/sharing)
  exportRecipes(): string {
    const recipes = this.getAllRecipes();
    return JSON.stringify(recipes, null, 2);
  }

  // Import recipes (from backup/sharing)
  importRecipes(recipesJson: string, mergeMode: 'replace' | 'merge' = 'merge'): boolean {
    try {
      const importedRecipes = JSON.parse(recipesJson) as Recipe[];
      
      // Validate imported recipes
      if (!Array.isArray(importedRecipes)) {
        throw new Error('Invalid recipes format');
      }
      
      if (mergeMode === 'replace') {
        // Replace all existing recipes
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(importedRecipes));
      } else {
        // Merge with existing recipes
        const existingRecipes = this.getAllRecipes();
        const mergedRecipes = [...existingRecipes];
        
        importedRecipes.forEach(importedRecipe => {
          const existingIndex = mergedRecipes.findIndex(r => r.id === importedRecipe.id);
          if (existingIndex >= 0) {
            // Update existing recipe
            mergedRecipes[existingIndex] = importedRecipe;
          } else {
            // Add new recipe
            mergedRecipes.push(importedRecipe);
          }
        });
        
        localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(mergedRecipes));
      }
      
      return true;
    } catch (error) {
      console.error('Error importing recipes:', error);
      return false;
    }
  }

  // Clear all recipes
  clearAllRecipes(): boolean {
    try {
      localStorage.removeItem(RECIPES_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing recipes from storage:', error);
      return false;
    }
  }

  // Get storage usage info
  getStorageInfo(): {
    recipeCount: number;
    storageSize: number;
    maxRecipes: number;
    percentageUsed: number;
  } {
    const recipes = this.getAllRecipes();
    const storageData = localStorage.getItem(RECIPES_STORAGE_KEY) || '';
    
    return {
      recipeCount: recipes.length,
      storageSize: storageData.length,
      maxRecipes: MAX_RECIPES,
      percentageUsed: (recipes.length / MAX_RECIPES) * 100
    };
  }
}

// Export singleton instance
export const recipeStorage = new RecipeStorageService();