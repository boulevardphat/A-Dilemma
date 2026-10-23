'use client';

import React from 'react';
import { PixelClock } from './PixelIcons';

interface PixelTimerProps {
  remaining: number; // in seconds
  total: number;
  running: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PixelTimer({ remaining, total, running, size = 'md' }: PixelTimerProps) {
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isUrgent = remaining <= 5 && remaining > 0;
  const isWarning = remaining <= 15 && remaining > 5;

  const colorClass = isUrgent
    ? 'text-red-400 border-red-500 bg-red-950/60 animate-pulse'
    : isWarning
    ? 'text-amber-400 border-amber-500 bg-amber-950/40'
    : 'text-emerald-400 border-emerald-500 bg-emerald-950/40';

  const progressPct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;

  return (
    <div className="flex flex-col items-center">
      {/* 8-bit Digital Clock Badge */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 border-2 border-black shadow-[0_3px_0_0_#000] ${colorClass}`}
      >
        <PixelClock className="w-4 h-4 shrink-0" />
        <span
          className={`font-pixel tracking-widest font-bold ${
            size === 'lg' ? 'text-2xl md:text-3xl' : size === 'sm' ? 'text-sm' : 'text-lg md:text-xl'
          }`}
        >
          {formattedTime}
        </span>
        <span className="text-[9px] font-pixel text-slate-300 ml-1">
          {remaining === 0 ? 'HẾT GIỜ' : running ? 'ĐANG CHẠY' : 'TẠM DỪNG'}
        </span>
      </div>

      {/* Mini 8-bit Progress Bar */}
      {total > 0 && (
        <div className="w-full max-w-[200px] h-2 bg-black border border-slate-700 mt-1 p-0.5">
          <div
            className={`h-full transition-all duration-300 ${
              isUrgent ? 'bg-red-500' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      )}
    </div>
  );
}
