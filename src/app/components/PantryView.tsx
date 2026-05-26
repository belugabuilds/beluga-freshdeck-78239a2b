"use client";

import React, { useState } from 'react';
import type { PantryItem } from '../types';
import { getExpiryStatus } from '../lib/expiry';
import PantryItemCard from './PantryItemCard';
import AddItemModal from './AddItemModal';

interface PantryViewProps {
  items: PantryItem[];
  onAdd: (item: Omit<PantryItem, 'id' | 'addedAt'>) => void;
  onEdit: (id: string, updated: Omit<PantryItem, 'id' | 'addedAt'>) => void;
  onDelete: (item: PantryItem) => void;
  onMarkUsed: (item: PantryItem) => void;
  onMarkDiscarded: (item: PantryItem) => void;
}

type Filter = 'all' | 'expired' | 'today' | 'soon' | 'ok';

export default function PantryView({
  items,
  onAdd,
  onEdit,
  onDelete,
  onMarkUsed,
  onMarkDiscarded,
}: PantryViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filters: { id: Filter; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
    { id: 'expired', label: '🔴 Expired', color: 'bg-red-100 text-red-700' },
    { id: 'today', label: '🟠 Today', color: 'bg-orange-100 text-orange-700' },
    { id: 'soon', label: '🟡 Soon', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'ok', label: '🟢 Good', color: 'bg-green-100 text-green-700' },
  ];

  const filtered = items
    .filter((item) => {
      if (filter !== 'all' && getExpiryStatus(item.expiryDate) !== filter)
        return false;
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      const order = { expired: 0, today: 1, soon: 2, ok: 3 };
      return (
        order[getExpiryStatus(a.expiryDate)] -
        order[getExpiryStatus(b.expiryDate)]
      );
    });

  function handleEdit(item: PantryItem) {
    setEditItem(item);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setEditItem(null);
  }

  function handleSave(data: Omit<PantryItem, 'id' | 'addedAt'>) {
    if (editItem) {
      onEdit(editItem.id, data);
    } else {
      onAdd(data);
    }
    handleModalClose();
  }

  const expiringCount = items.filter((i) => {
    const s = getExpiryStatus(i.expiryDate);
    return s === 'expired' || s === 'today' || s === 'soon';
  }).length;

  return (
    <div className="space-y-4">
      {expiringCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold text-orange-800 text-sm">
              {expiringCount} item{expiringCount > 1 ? 's' : ''} need{expiringCount === 1 ? 's' : ''} attention
            </p>
            <p className="text-xs text-orange-600">
              Check the Recipes tab for quick ideas to use them up.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition bg-white"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-semibold transition whitespace-nowrap"
        >
          + Add Item
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition border ${
              filter === f.id
                ? `${f.color} border-transparent ring-2 ring-offset-1 ring-emerald-400`
                : `${f.color} border-transparent opacity-60 hover:opacity-100`
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🥗</p>
          <p className="text-base font-medium text-gray-500">Your pantry is empty</p>
          <p className="text-sm mt-1">Add your first item to get started.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">No items match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={onDelete}
              onMarkUsed={onMarkUsed}
              onMarkDiscarded={onMarkDiscarded}
            />
          ))}
        </div>
      )}

      <AddItemModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        editItem={editItem}
      />
    </div>
  );
}
