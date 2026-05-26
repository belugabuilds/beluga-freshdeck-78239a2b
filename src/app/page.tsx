"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { PantryItem, WasteLogEntry } from './types';
import {
  getPantryItems,
  savePantryItems,
  getWasteLog,
  addWasteLogEntry,
} from './lib/storage';
import Nav from './components/Nav';
import PantryView from './components/PantryView';
import RecipesView from './components/RecipesView';
import StatsView from './components/StatsView';

type Tab = 'pantry' | 'recipes' | 'stats';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pantry');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [wasteLog, setWasteLog] = useState<WasteLogEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPantryItems(getPantryItems());
    setWasteLog(getWasteLog());
    setMounted(true);
  }, []);

  const handleAddItem = useCallback(
    (data: Omit<PantryItem, 'id' | 'addedAt'>) => {
      const newItem: PantryItem = {
        ...data,
        id: generateId(),
        addedAt: new Date().toISOString(),
      };
      setPantryItems((prev) => {
        const updated = [...prev, newItem];
        savePantryItems(updated);
        return updated;
      });
    },
    []
  );

  const handleEditItem = useCallback(
    (id: string, data: Omit<PantryItem, 'id' | 'addedAt'>) => {
      setPantryItems((prev) => {
        const updated = prev.map((item) =>
          item.id === id ? { ...item, ...data } : item
        );
        savePantryItems(updated);
        return updated;
      });
    },
    []
  );

  const handleDeleteItem = useCallback((item: PantryItem) => {
    setPantryItems((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      savePantryItems(updated);
      return updated;
    });
  }, []);

  const handleMarkUsed = useCallback((item: PantryItem) => {
    const entry: WasteLogEntry = {
      id: generateId(),
      itemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      type: 'used',
      loggedAt: new Date().toISOString(),
      month: getMonthKey(new Date()),
    };
    addWasteLogEntry(entry);
    setWasteLog((prev) => [...prev, entry]);
    setPantryItems((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      savePantryItems(updated);
      return updated;
    });
  }, []);

  const handleMarkDiscarded = useCallback((item: PantryItem) => {
    const entry: WasteLogEntry = {
      id: generateId(),
      itemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      type: 'discarded',
      loggedAt: new Date().toISOString(),
      month: getMonthKey(new Date()),
    };
    addWasteLogEntry(entry);
    setWasteLog((prev) => [...prev, entry]);
    setPantryItems((prev) => {
      const updated = prev.filter((i) => i.id !== item.id);
      savePantryItems(updated);
      return updated;
    });
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl mb-2">🌿</p>
          <p className="text-gray-500 text-sm">Loading FreshDeck...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-3xl mx-auto px-4 py-5">
        {activeTab === 'pantry' && (
          <PantryView
            items={pantryItems}
            onAdd={handleAddItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onMarkUsed={handleMarkUsed}
            onMarkDiscarded={handleMarkDiscarded}
          />
        )}
        {activeTab === 'recipes' && (
          <RecipesView pantryItems={pantryItems} />
        )}
        {activeTab === 'stats' && <StatsView wasteLog={wasteLog} />}
      </main>
    </div>
  );
}
