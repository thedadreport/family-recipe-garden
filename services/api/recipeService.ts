// Recipe-specific API service for generating recipes with Claude

// Recipe and profile interfaces
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

interface UserProfile {
  adults: number;
  kids: number;
  dietaryPrefs: string[];
  timeAvailable: string;
  cookingLevel: string;
  ingredients: string;
  cookingMethod: string;
  seasonal: boolean;
  cuisine: string;
  mealType: string;
}

// Recipe generation options
interface RecipeGenerationOptions {
  maxTokens?: number;
  temperature?: number;
  includeNutrition?: boolean;
  difficultyLevel?: 'easy' | 'medium' | 'hard';
}

// Claude API call function (matching existing pattern)
const claudeApiCall = async (prompt: string, options: { maxTokens?: number } = {}): Promise<any> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return await response.json();
};

class RecipeApiService {
  // Build recipe prompt based on situation and profile
  private buildRecipePrompt(situation: string, profile: UserProfile, options: RecipeGenerationOptions = {}): string {
    const timeText = this.getTimeText(profile.timeAvailable);
    const seasonalText = profile.seasonal ? 'use seasonal ingredients (August summer produce)' : 'use any available ingredients';
    const cuisineText = profile.cuisine || 'any cuisine style';
    const mealTypeText = profile.mealType || 'whole meal';
    const methodText = profile.cookingMethod || 'any method';
    
    let basePrompt = '';

    switch (situation) {
      case 'protein-random':
        basePrompt = this.buildProteinRandomPrompt(profile, timeText, seasonalText, cuisineText);
        break;
      case 'stretch-protein':
        basePrompt = this.buildStretchProteinPrompt(profile, timeText, seasonalText, cuisineText);
        break;
      case 'tomorrow-lunch':
        basePrompt = this.buildTomorrowLunchPrompt(profile, timeText, methodText);
        break;
      case 'one-pot':
        basePrompt = this.buildOnePotPrompt(profile, timeText, methodText);
        break;
      case 'dump-bake':
        basePrompt = this.buildDumpBakePrompt(profile, timeText);
        break;
      default:
        basePrompt = this.buildGeneralPrompt(profile, timeText, seasonalText, cuisineText, mealTypeText, methodText);
    }

    return basePrompt + this.buildResponseFormat(options);
  }

  private getTimeText(timeAvailable: string): string {
    const timeMap: Record<string, string> = {
      'under30': 'Under 30 minutes',
      '30-60': '30-60 minutes',
      '60plus': '60+ minutes'
    };
    return timeMap[timeAvailable] || 'flexible timing';
  }

  private buildProteinRandomPrompt(profile: UserProfile, timeText: string, seasonalText: string, cuisineText: string): string {
    return `I need help creating a dinner recipe with what I have on hand.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Protein: ${profile.ingredients ? profile.ingredients.split(',')[0] : 'chicken'}
- Available ingredients: ${profile.ingredients || 'onions, garlic, potatoes'}

PREFERENCES
- Dietary restrictions: ${profile.dietaryPrefs.join(', ') || 'None'}
- Cuisine preference: ${cuisineText}
- Seasonal preference: ${seasonalText}

REQUIREMENTS
- Minimal steps (under 8 steps)
- Minimal cleanup
- Common ingredients only (nothing exotic)
- Family-friendly (kids will actually eat it)`;
  }

  private buildStretchProteinPrompt(profile: UserProfile, timeText: string, seasonalText: string, cuisineText: string): string {
    return `I need to stretch a small amount of protein to feed more people than planned.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Protein: ${profile.ingredients ? profile.ingredients.split(',')[0] + ' (small amount for ' + (profile.adults + profile.kids) + ' people)' : 'small amount of protein for ' + (profile.adults + profile.kids) + ' people'}
- Available ingredients to bulk up: ${profile.ingredients || 'pasta, rice, beans, vegetables'}

PREFERENCES
- Dietary restrictions: ${profile.dietaryPrefs.join(', ') || 'None'}
- Cuisine preference: ${cuisineText}
- Seasonal preference: ${seasonalText}

REQUIREMENTS
- Make the protein go further without it feeling skimpy
- Minimal steps (under 8 steps)
- Family-friendly (kids will actually eat it)
- Filling and satisfying despite less protein per person`;
  }

  private buildTomorrowLunchPrompt(profile: UserProfile, timeText: string, methodText: string): string {
    return `I need to cook dinner tonight that will also provide good leftovers for tomorrow's lunch.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Main ingredients: ${profile.ingredients || 'chicken, vegetables, rice'}
- Cooking method: ${methodText}

REQUIREMENTS
- Makes enough for dinner + 2-4 lunch portions
- Reheats well (tastes good the next day)
- Portable/lunch-friendly format
- Minimal steps (under 8 steps)
- Family-friendly (kids will actually eat it)`;
  }

  private buildOnePotPrompt(profile: UserProfile, timeText: string, methodText: string): string {
    return `I need a complete dinner that can be made in one pot for easy cleanup.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Main ingredients: ${profile.ingredients || 'protein and vegetables'}
- Cooking method: ${methodText}

REQUIREMENTS
- Everything cooks in ONE pot only
- Minimal steps (under 8 steps)
- Complete meal (protein + vegetables + starch all together)
- Family-friendly (kids will actually eat it)`;
  }

  private buildDumpBakePrompt(profile: UserProfile, timeText: string): string {
    return `I need a complete dinner that can be made on one sheet pan in the oven.

FAMILY INFO
- Adults: ${profile.adults}
- Kids: ${profile.kids}
- Time available: ${timeText}
- Cooking skill level: ${profile.cookingLevel}

WHAT I HAVE
- Main ingredients: ${profile.ingredients || 'protein and vegetables'}
- Sheet pan cooking

REQUIREMENTS
- Everything cooks on ONE sheet pan in the oven
- Minimal steps (under 6 steps)
- Complete meal (protein + vegetables + starch if possible)
- Family-friendly (kids will actually eat it)`;
  }

  private buildGeneralPrompt(profile: UserProfile, timeText: string, seasonalText: string, cuisineText: string, mealTypeText: string, methodText: string): string {
    return `Create a family recipe for ${profile.adults} adults and ${profile.kids} kids.
      
Dietary preferences: ${profile.dietaryPrefs.join(', ') || 'None'}
Available time: ${timeText}
Cooking level: ${profile.cookingLevel}
Cooking method: ${methodText}
Seasonal preference: ${seasonalText}
Cuisine style: ${cuisineText}
Meal type: ${mealTypeText}
Main ingredients to use: ${profile.ingredients || 'chef\'s choice'}

COOKING PHILOSOPHY:
- Use high-quality, simple ingredients
- Focus on seasonal, fresh ingredients when possible
- Techniques should be approachable but proper
- Make recipes that bring families together`;
  }

  private buildResponseFormat(options: RecipeGenerationOptions): string {
    const nutritionSection = options.includeNutrition ? ',\n  "nutrition": {"calories": "per serving", "protein": "grams", "carbs": "grams", "fat": "grams"}' : '';
    
    return `

Please provide a JSON response:
{
  "title": "Recipe name",
  "totalTime": "cooking time",
  "servings": "number of servings",
  "ingredients": ["ingredient with quality notes when helpful"],
  "instructions": ["step by step instructions"],
  "tips": ["helpful cooking tips"],
  "notes": "Additional notes or variations"${nutritionSection}
}

Your entire response must be valid JSON only.`;
  }

  // Generate recipe using Claude API
  async generateRecipe(
    situation: string, 
    profile: UserProfile, 
    options: RecipeGenerationOptions = {}
  ): Promise<Recipe> {
    const prompt = this.buildRecipePrompt(situation, profile, options);
    
    const response = await claudeApiCall(prompt, { 
      maxTokens: options.maxTokens || 1500 
    });
    
    // Parse the JSON response (same logic as existing components)
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const recipeData = JSON.parse(responseText);
    
    const recipe: Recipe = {
      id: Date.now(),
      title: recipeData.title || 'Untitled Recipe',
      totalTime: recipeData.totalTime || '30 minutes',
      servings: recipeData.servings || `${profile.adults + profile.kids}`,
      ingredients: recipeData.ingredients || [],
      instructions: recipeData.instructions || [],
      tips: recipeData.tips || [],
      notes: recipeData.notes || '',
      isFavorite: false,
      situation,
      cookingMethod: profile.cookingMethod,
      seasonal: profile.seasonal,
      cuisine: profile.cuisine,
      mealType: profile.mealType,
      createdAt: new Date()
    };

    return recipe;
  }

  // Generate multiple recipe variations
  async generateRecipeVariations(
    situation: string,
    profile: UserProfile,
    count: number = 3,
    options: RecipeGenerationOptions = {}
  ): Promise<Recipe[]> {
    const recipes: Recipe[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        // Add slight variation to each prompt
        const modifiedProfile = { ...profile };
        if (i > 0) {
          modifiedProfile.ingredients += ` (variation ${i + 1})`;
        }
        
        const recipe = await this.generateRecipe(situation, modifiedProfile, options);
        recipe.id = Date.now() + i; // Ensure unique IDs
        recipes.push(recipe);
        
        // Small delay to avoid rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error generating recipe variation ${i + 1}:`, error);
        // Continue with other variations
      }
    }
    
    return recipes;
  }

  // Generate recipe with specific dietary modifications
  async generateDietaryVariant(
    baseRecipe: Recipe,
    dietaryModification: string
  ): Promise<Recipe> {
    const prompt = `Take this recipe and modify it for ${dietaryModification}:

ORIGINAL RECIPE:
Title: ${baseRecipe.title}
Ingredients: ${baseRecipe.ingredients.join(', ')}
Instructions: ${baseRecipe.instructions.join(' ')}

MODIFICATION REQUESTED: ${dietaryModification}

Please provide a JSON response with the modified recipe:
{
  "title": "Modified recipe name",
  "totalTime": "cooking time",
  "servings": "number of servings",
  "ingredients": ["modified ingredients"],
  "instructions": ["modified instructions"],
  "tips": ["helpful tips for this dietary modification"],
  "notes": "Notes about the dietary modifications made"
}

Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 1500 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const recipeData = JSON.parse(responseText);
    
    const modifiedRecipe: Recipe = {
      ...baseRecipe,
      id: Date.now(),
      title: recipeData.title || `${baseRecipe.title} (${dietaryModification})`,
      ingredients: recipeData.ingredients || baseRecipe.ingredients,
      instructions: recipeData.instructions || baseRecipe.instructions,
      tips: recipeData.tips || baseRecipe.tips,
      notes: recipeData.notes || baseRecipe.notes,
      createdAt: new Date()
    };

    return modifiedRecipe;
  }

  // Generate recipe scaling (for different serving sizes)
  async scaleRecipe(
    baseRecipe: Recipe,
    newServings: number
  ): Promise<Recipe> {
    const currentServings = parseInt(baseRecipe.servings) || 4;
    const scaleFactor = newServings / currentServings;
    
    const prompt = `Scale this recipe from ${currentServings} servings to ${newServings} servings:

ORIGINAL RECIPE:
${baseRecipe.ingredients.join('\n')}

Scale all ingredient quantities by ${scaleFactor}x. Be smart about:
- Spices and seasonings (don't always scale linearly)
- Cooking times (may need adjustment)
- Pan sizes and cooking methods

Please provide a JSON response:
{
  "ingredients": ["scaled ingredients with adjusted quantities"],
  "instructions": ["instructions with any timing/method adjustments"],
  "tips": ["tips for cooking the scaled version"],
  "totalTime": "adjusted cooking time if needed"
}

Your entire response must be valid JSON only.`;

    const response = await claudeApiCall(prompt, { maxTokens: 1000 });
    
    let responseText = response.content?.[0]?.text || '';
    responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const scaleData = JSON.parse(responseText);
    
    const scaledRecipe: Recipe = {
      ...baseRecipe,
      id: Date.now(),
      servings: newServings.toString(),
      ingredients: scaleData.ingredients || baseRecipe.ingredients,
      instructions: scaleData.instructions || baseRecipe.instructions,
      tips: scaleData.tips || baseRecipe.tips,
      totalTime: scaleData.totalTime || baseRecipe.totalTime,
      title: `${baseRecipe.title} (${newServings} servings)`,
      createdAt: new Date()
    };

    return scaledRecipe;
  }
}

// Export singleton instance
export const recipeApiService = new RecipeApiService();