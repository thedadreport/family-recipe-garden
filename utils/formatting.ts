// Formatting utilities for Family Recipe Garden
// Based on the data structures from the existing React components

// Time formatting
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

// Cost formatting
export const formatCost = (cost: string | number): string => {
  if (typeof cost === 'string') {
    // If it already has $ symbol, return as is
    if (cost.includes('$')) return cost;
    
    // Try to parse as number
    const numCost = parseFloat(cost.replace(/[^\d.]/g, ''));
    if (isNaN(numCost)) return cost;
    cost = numCost;
  }
  
  if (typeof cost === 'number') {
    return `$${cost.toFixed(2)}`;
  }
  
  return String(cost);
};

// Budget formatting for display
export const formatBudget = (budget: string): string => {
  if (!budget) return '';
  const cleanBudget = budget.replace(/[$,\s]/g, '');
  const numBudget = parseFloat(cleanBudget);
  
  if (isNaN(numBudget)) return budget;
  return `$${numBudget.toFixed(0)}`;
};

// Servings formatting
export const formatServings = (adults: number, kids: number): string => {
  const total = adults + kids;
  const parts = [];
  
  if (adults > 0) parts.push(`${adults} adult${adults > 1 ? 's' : ''}`);
  if (kids > 0) parts.push(`${kids} kid${kids > 1 ? 's' : ''}`);
  
  return `${total} (${parts.join(', ')})`;
};

// Dietary preferences formatting
export const formatDietaryPrefs = (prefs: string[]): string => {
  if (!prefs || prefs.length === 0) return 'None';
  
  if (prefs.length === 1) return prefs[0];
  if (prefs.length === 2) return `${prefs[0]} and ${prefs[1]}`;
  
  const lastPref = prefs[prefs.length - 1];
  const otherPrefs = prefs.slice(0, -1);
  return `${otherPrefs.join(', ')}, and ${lastPref}`;
};

// Recipe title formatting
export const formatRecipeTitle = (title: string): string => {
  // Capitalize first letter of each word
  return title
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Ingredient formatting for shopping lists
export const formatIngredientForShopping = (ingredient: string): { item: string; quantity: string; notes: string } => {
  // Try to extract quantity and item from ingredient string
  const quantityRegex = /^(\d+(?:\/\d+)?(?:\.\d+)?\s*(?:lbs?|pounds?|oz|ounces?|cups?|tbsp|tsp|teaspoons?|tablespoons?|cloves?|large|medium|small)?)\s+(.+)/i;
  const match = ingredient.match(quantityRegex);
  
  if (match) {
    const [, quantity, item] = match;
    // Extract any notes in parentheses
    const noteMatch = item.match(/^([^(]+)(\(.+\))?/);
    if (noteMatch) {
      const [, cleanItem, notes] = noteMatch;
      return {
        item: cleanItem.trim(),
        quantity: quantity.trim(),
        notes: notes ? notes.trim() : ''
      };
    }
    return {
      item: item.trim(),
      quantity: quantity.trim(),
      notes: ''
    };
  }
  
  // If no quantity found, treat whole string as item
  const noteMatch = ingredient.match(/^([^(]+)(\(.+\))?/);
  if (noteMatch) {
    const [, item, notes] = noteMatch;
    return {
      item: item.trim(),
      quantity: '',
      notes: notes ? notes.trim() : ''
    };
  }
  
  return {
    item: ingredient.trim(),
    quantity: '',
    notes: ''
  };
};

// Shopping list formatting for copy/paste (matching existing copyShoppingList function)
export const formatShoppingListForExport = (shoppingList: Array<{
  section: string;
  items: Array<{
    item: string;
    quantity: string;
    estimatedCost?: string;
  }>;
}>, totalCost?: string): string => {
  let output = 'WEEKLY SHOPPING LIST\n\n';
  
  shoppingList.forEach(section => {
    output += `${section.section.toUpperCase()}:\n`;
    section.items.forEach(item => {
      const formattedItem = `• ${item.item} - ${item.quantity}`;
      const cost = item.estimatedCost ? ` (${formatCost(item.estimatedCost)})` : '';
      output += `${formattedItem}${cost}\n`;
    });
    output += '\n';
  });
  
  if (totalCost) {
    output += `ESTIMATED TOTAL: ${formatCost(totalCost)}\n`;
  }
  
  return output;
};

// Recipe export formatting (for sharing recipes)
export const formatRecipeForExport = (recipe: {
  title: string;
  servings: string;
  totalTime: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  notes?: string;
}): string => {
  let output = `${recipe.title.toUpperCase()}\n`;
  output += `${'='.repeat(recipe.title.length)}\n\n`;
  
  // Recipe info
  output += `Serves: ${recipe.servings}\n`;
  output += `Total Time: ${recipe.totalTime}\n\n`;
  
  // Ingredients
  output += 'INGREDIENTS:\n';
  recipe.ingredients.forEach(ingredient => {
    output += `• ${ingredient}\n`;
  });
  output += '\n';
  
  // Instructions
  output += 'INSTRUCTIONS:\n';
  recipe.instructions.forEach((instruction, index) => {
    output += `${index + 1}. ${instruction}\n`;
  });
  
  if (recipe.tips && recipe.tips.length > 0) {
    output += '\nTIPS:\n';
    recipe.tips.forEach(tip => {
      output += `• ${tip}\n`;
    });
  }
  
  if (recipe.notes) {
    output += `\nNOTES:\n${recipe.notes}\n`;
  }
  
  return output;
};

// Profile summary formatting for prompts
export const formatProfileForPrompt = (profile: {
  adults: number;
  kids: number;
  dietaryPrefs?: string[];
  timeAvailable?: string;
  cookingLevel?: string;
}): string => {
  const parts = [];
  
  parts.push(`Family: ${formatServings(profile.adults, profile.kids)}`);
  
  if (profile.dietaryPrefs && profile.dietaryPrefs.length > 0) {
    parts.push(`Dietary: ${formatDietaryPrefs(profile.dietaryPrefs)}`);
  }
  
  if (profile.timeAvailable) {
    const timeLabels: Record<string, string> = {
      'under30': '< 30 minutes',
      '30-60': '30-60 minutes',
      '60plus': '60+ minutes'
    };
    parts.push(`Time: ${timeLabels[profile.timeAvailable] || profile.timeAvailable}`);
  }
  
  if (profile.cookingLevel) {
    parts.push(`Skill: ${profile.cookingLevel}`);
  }
  
  return parts.join(' • ');
};

// Format date for display
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short', 
    day: 'numeric'
  });
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Format array as natural language list
export const formatList = (items: string[]): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(', ')}, and ${lastItem}`;
};