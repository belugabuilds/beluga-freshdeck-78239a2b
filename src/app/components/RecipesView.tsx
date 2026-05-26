"use client";

import React, { useState } from 'react';
import type { PantryItem } from '../types';
import { getRecipeSuggestions } from '../lib/recipes';

interface RecipesViewProps {
  pantryItems: PantryItem[];
}

export default function RecipesView({ pantryItems }: RecipesViewProps) {
  const [mode, setMode] = useState<'expiring' | 'all'>('expiring');
  const [expanded, setExpanded] = useState<string | null>(null);

  const suggestions = getRecipeSuggestions(pantryItems, mode);

  const expiringItems = pantryItems.filter((item) => {
    const { getExpiryStatus } = require('../lib/expiry');
    const s = getExpiryStatus(item.expiryDate);
    return s === 'expired' || s === 'today' || s === 'soon';
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gray-800">Recipe Suggestions</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {mode === 'expiring'
              ? `Based on ${expiringItems.length} expiring item${expiringItems.length !== 1 ? 's' : ''}`
              : `Based on all ${pantryItems.length} pantry item${pantryItems.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setMode('expiring')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
              mode === 'expiring'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            ⏰ Expiring
          </button>
          <button
            onClick={() => setMode('all')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
              mode === 'all'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🥗 All Items
          </button>
        </div>
      </div>

      {pantryItems.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🍳</p>
          <p className="text-base font-medium text-gray-500">No pantry items yet</p>
          <p className="text-sm mt-1">Add items to your pantry to get recipe ideas.</p>
        </div>
      ) : mode === 'expiring' && expiringItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-base font-semibold text-gray-600">Nothing expiring soon!</p>
          <p className="text-sm text-gray-400 mt-1">
            Switch to "All Items" to browse recipes from your full pantry.
          </p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🤔</p>
          <p className="text-base font-medium text-gray-500">No matching recipes found</p>
          <p className="text-sm mt-1">
            Try adding more common ingredients like eggs, bread, or tomatoes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-50 transition"
                onClick={() =>
                  setExpanded(expanded === recipe.id ? null : recipe.id)
                }
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-800 text-sm">
                      {recipe.name}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {recipe.matchCount}/{recipe.ingredients.length} ingredients
                    </span>
                    <span className="text-xs text-gray-400">⏱ {recipe.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {recipe.description}
                  </p>
                </div>
                <span className="text-gray-400 text-sm flex-shrink-0">
                  {expanded === recipe.id ? '▲' : '▼'}
                </span>
              </button>
              {expanded === recipe.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1.5">Ingredients:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.ingredients.map((ing) => {
                        const isMatched = recipe.matchedIngredients
                          .map((m) => m.toLowerCase())
                          .includes(ing.toLowerCase());
                        return (
                          <span
                            key={ing}
                            className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                              isMatched
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border-gray-200'
                            }`}
                          >
                            {isMatched ? '✓ ' : ''}{ing}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-amber-700 mb-0.5">💡 Tip</p>
                    <p className="text-xs text-amber-700">
                      {recipe.description} You may substitute any missing ingredients.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
