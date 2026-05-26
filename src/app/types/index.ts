export type ExpiryStatus = 'expired' | 'today' | 'soon' | 'ok';

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string; // ISO date string YYYY-MM-DD
  addedAt: string; // ISO datetime string
}

export interface WasteLogEntry {
  id: string;
  itemId: string;
  itemName: string;
  quantity: string;
  type: 'used' | 'discarded';
  loggedAt: string; // ISO datetime string
  month: string; // YYYY-MM
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  description: string;
  time: string;
}

export interface MonthlyStats {
  month: string;
  saved: number;
  wasted: number;
}
