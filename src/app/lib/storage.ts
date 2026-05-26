"use client";

import type { PantryItem, WasteLogEntry } from '../types';

const PANTRY_KEY = 'freshdeck_pantry';
const WASTE_LOG_KEY = 'freshdeck_waste_log';

export function getPantryItems(): PantryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PANTRY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePantryItems(items: PantryItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PANTRY_KEY, JSON.stringify(items));
}

export function getWasteLog(): WasteLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WASTE_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWasteLog(log: WasteLogEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WASTE_LOG_KEY, JSON.stringify(log));
}

export function addWasteLogEntry(entry: WasteLogEntry): void {
  const log = getWasteLog();
  log.push(entry);
  saveWasteLog(log);
}
