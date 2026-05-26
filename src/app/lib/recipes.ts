import recipesData from '../data/recipes.json';
import type { Recipe, PantryItem } from '../types';
import { getExpiryStatus } from './expiry';

const recipes: Recipe[] = recipesData as Recipe[];

export function getRecipeSuggestions(
  pantryItems: PantryItem[],
  mode: 'expiring' | 'all' = 'expiring'
): Array<Recipe & { matchCount: number; matchedIngredients: string[] }> {
  const itemsToUse =
    mode === 'expiring'
      ? pantryItems.filter((item) => {
          const status = getExpiryStatus(item.expiryDate);
          return status === 'expired' || status === 'today' || status === 'soon';
        })
      : pantryItems;

  if (itemsToUse.length === 0) return [];

  const normalizedNames = itemsToUse.map((item) =>
    item.name.toLowerCase().trim()
  );

  const scored = recipes.map((recipe) => {
    const matchedIngredients: string[] = [];
    recipe.ingredients.forEach((ing) => {
      const normalizedIng = ing.toLowerCase().trim();
      const match = normalizedNames.some(
        (name) =>
          name.includes(normalizedIng) || normalizedIng.includes(name)
      );
      if (match) matchedIngredients.push(ing);
    });
    return {
      ...recipe,
      matchCount: matchedIngredients.length,
      matchedIngredients,
    };
  });

  return scored
    .filter((r) => r.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
}
