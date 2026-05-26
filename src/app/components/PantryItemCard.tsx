"use client";

import React from 'react';
import type { PantryItem } from '../types';
import { getExpiryStatus, formatExpiryLabel, getStatusColors } from '../lib/expiry';

interface PantryItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
  onDelete: (item: PantryItem) => void;
  onMarkUsed: (item: PantryItem) => void;
  onMarkDiscarded: (item: PantryItem) => void;
}

export default function PantryItemCard({
  item,
  onEdit,
  onDelete,
  onMarkUsed,
  onMarkDiscarded,
}: PantryItemCardProps) {
  const status = getExpiryStatus(item.expiryDate);
  const colors = getStatusColors(status);
  const label = formatExpiryLabel(item.expiryDate);

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-base truncate">{item.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${colors.badge}`}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onMarkUsed(item)}
          className="flex-1 min-w-[72px] text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-1.5 px-2 font-medium transition"
        >
          ✓ Used
        </button>
        <button
          onClick={() => onMarkDiscarded(item)}
          className="flex-1 min-w-[72px] text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-1.5 px-2 font-medium transition"
        >
          🗑 Discard
        </button>
        <button
          onClick={() => onEdit(item)}
          className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-lg hover:bg-white/60 transition"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(item)}
          className="text-xs text-red-400 hover:text-red-600 px-2 py-1.5 rounded-lg hover:bg-white/60 transition"
        >
          ×
        </button>
      </div>
    </div>
  );
}
