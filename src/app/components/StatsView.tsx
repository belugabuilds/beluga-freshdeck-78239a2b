"use client";

import React, { useMemo } from 'react';
import type { WasteLogEntry } from '../types';

interface StatsViewProps {
  wasteLog: WasteLogEntry[];
}

export default function StatsView({ wasteLog }: StatsViewProps) {
  const monthlyStats = useMemo(() => {
    const map = new Map<string, { saved: number; wasted: number }>();
    wasteLog.forEach((entry) => {
      const existing = map.get(entry.month) || { saved: 0, wasted: 0 };
      if (entry.type === 'used') {
        existing.saved += 1;
      } else {
        existing.wasted += 1;
      }
      map.set(entry.month, existing);
    });
    return Array.from(map.entries())
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [wasteLog]);

  const totalSaved = wasteLog.filter((e) => e.type === 'used').length;
  const totalWasted = wasteLog.filter((e) => e.type === 'discarded').length;
  const total = totalSaved + totalWasted;
  const saveRate = total > 0 ? Math.round((totalSaved / total) * 100) : 0;

  function formatMonth(monthStr: string) {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{totalSaved}</p>
          <p className="text-xs text-emerald-700 font-medium mt-0.5">Items Saved</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{totalWasted}</p>
          <p className="text-xs text-red-600 font-medium mt-0.5">Items Wasted</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{saveRate}%</p>
          <p className="text-xs text-blue-700 font-medium mt-0.5">Save Rate</p>
        </div>
      </div>

      {total > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">Overall Progress</p>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${saveRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>100% saved</span>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">Monthly Breakdown</h3>
        {monthlyStats.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-base font-medium text-gray-500">No data yet</p>
            <p className="text-sm mt-1">
              Mark pantry items as "Used" or "Discarded" to track your waste over time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {monthlyStats.map(({ month, saved, wasted }) => {
              const monthTotal = saved + wasted;
              const monthRate =
                monthTotal > 0 ? Math.round((saved / monthTotal) * 100) : 0;
              return (
                <div
                  key={month}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      {formatMonth(month)}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        monthRate >= 70
                          ? 'bg-emerald-100 text-emerald-700'
                          : monthRate >= 40
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {monthRate}% saved
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all ${
                        monthRate >= 70
                          ? 'bg-emerald-400'
                          : monthRate >= 40
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${monthRate}%` }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      <span className="text-xs text-gray-600">
                        {saved} used
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      <span className="text-xs text-gray-600">
                        {wasted} discarded
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {wasteLog.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {[...wasteLog]
              .sort(
                (a, b) =>
                  new Date(b.loggedAt).getTime() -
                  new Date(a.loggedAt).getTime()
              )
              .slice(0, 10)
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3 py-2"
                >
                  <span className="text-base">
                    {entry.type === 'used' ? '✅' : '🗑️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {entry.itemName}
                    </p>
                    <p className="text-xs text-gray-400">Qty: {entry.quantity}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      entry.type === 'used'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {entry.type === 'used' ? 'Used' : 'Discarded'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
