'use client';

import React from 'react';

export function PixelCredit({ className = '' }: { className?: string }) {
  return (
    <footer className={`w-full py-2.5 text-center select-none ${className}`}>
      <p className="text-[11px] sm:text-xs font-mono font-medium text-zinc-400 tracking-wider">
        tạo bởi <span className="font-bold text-zinc-600">Boulevard - Thuận Phát</span>
      </p>
    </footer>
  );
}
