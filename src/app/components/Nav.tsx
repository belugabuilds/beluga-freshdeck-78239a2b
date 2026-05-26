"use client";

import React from 'react';

type Tab = 'pantry' | 'recipes' | 'stats';

interface NavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Nav({ activeTab, onTabChange }: NavProps) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'pantry', label: 'Pantry', icon: '🥦' },
    { id: 'recipes', label: 'Recipes', icon: '🍳' },
    { id: 'stats', label: 'Stats', icon: '📊' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="font-bold text-gray-800 text-lg tracking-tight">FreshDeck</span>
          </div>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
