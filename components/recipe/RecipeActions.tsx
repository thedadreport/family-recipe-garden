import React, { useState } from 'react';
import { Star, Bookmark, Share2, Copy, CheckCircle } from 'lucide-react';
import { Recipe } from '../../types/recipe';
import { Button } from '../common/Button';

interface RecipeActionsProps {
  recipe: Recipe;
  onSaveRecipe: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: number) => void;
  showSave?: boolean;
  showFavorite?: boolean;
  showShare?: boolean;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
}

export function RecipeActions({ 
  recipe, 
  onSaveRecipe, 
  onToggleFavorite,
  showSave = true,
  showFavorite = true,
  showShare = true,
  layout = 'horizontal',
  size = 'md'
}: RecipeActionsProps) {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveRecipe = async () => {
    setSaving(true);
    try {
      await onSaveRecipe(recipe);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(recipe.id);
  };

  const handleCopyRecipe = async () => {
    try {
      const recipeText = formatRecipeForSharing(recipe);
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recipe:', err);
    }
  };

  const formatRecipeForSharing = (recipe: Recipe): string => {
    let text = `${recipe.title}\n`;
    text += `⏱️ ${recipe.totalTime} | 👥 Serves ${recipe.servings}\n\n`;
    
    if (recipe.ingredients.length > 0) {
      text += `INGREDIENTS:\n`;
      recipe.ingredients.forEach(ingredient => {
        text += `• ${ingredient}\n`;
      });
      text += '\n';
    }
    
    if (recipe.instructions.length > 0) {
      text += `INSTRUCTIONS:\n`;
      recipe.instructions.forEach((instruction, index) => {
        text += `${index + 1}. ${instruction}\n`;
      });
      text += '\n';
    }
    
    if (recipe.tips && recipe.tips.length > 0) {
      text += `TIPS:\n`;
      recipe.tips.forEach(tip => {
        text += `• ${tip}\n`;
      });
      text += '\n';
    }
    
    if (recipe.notes) {
      text += `NOTES:\n${recipe.notes}\n\n`;
    }
    
    text += `Made with Family Recipe Garden 🌿`;
    
    return text;
  };

  const containerClasses = layout === 'horizontal' 
    ? 'flex space-x-3' 
    : 'flex flex-col space-y-3';

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

  return (
    <div className={containerClasses}>
      {showSave && (
        <Button
          variant="primary"
          size={buttonSize}
          onClick={handleSaveRecipe}
          loading={saving}
          icon={<Bookmark className="h-4 w-4" />}
        >
          {saving ? 'Saving...' : 'Save Recipe'}
        </Button>
      )}

      {showFavorite && (
        <Button
          variant={recipe.isFavorite ? 'secondary' : 'outline'}
          size={buttonSize}
          onClick={handleToggleFavorite}
          icon={
            <Star 
              className={`h-4 w-4 ${recipe.isFavorite ? 'fill-current text-yellow-500' : ''}`} 
            />
          }
          className={recipe.isFavorite ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100' : ''}
        >
          {recipe.isFavorite ? 'Favorited' : 'Favorite'}
        </Button>
      )}

      {showShare && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size={buttonSize}
            onClick={handleCopyRecipe}
            icon={copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            className={copied ? 'border-green-300 text-green-700 bg-green-50' : ''}
          >
            {copied ? 'Copied!' : 'Copy Recipe'}
          </Button>
        </div>
      )}
    </div>
  );
}