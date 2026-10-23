'use client';

import React from 'react';
import { TwistInfo } from '@/lib/types';
import { PixelPointerHand } from './PixelIcons';

interface PixelBreakingNewsProps {
  twist: TwistInfo | null;
  isHost?: boolean;
  onHostStartTimer?: () => void;
  timerRunning?: boolean;
}

export function PixelBreakingNews({
  twist,
  isHost = false,
  onHostStartTimer,
  timerRunning = false,
}: PixelBreakingNewsProps) {
  if (!twist) return null;

  if (isHost && timerRunning) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050C24]/95 backdrop-blur-md animate-fadeIn text-white select-none">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.25) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center py-6 px-4">
        {/* Iconic TV Broadcast Header */}
        <div className="inline-flex flex-col items-center mb-6">
          <div className="relative bg-[#E50914] text-white px-8 py-2 transform -skew-x-12 shadow-[0_4px_20px_rgba(229,9,20,0.5)]">
            <span className="block transform skew-x-12 text-2xl sm:text-4xl font-black italic tracking-wider">
              BREAKING
            </span>
          </div>

          <div className="text-4xl sm:text-6xl font-black italic tracking-widest text-white mt-1 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            NEWS
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-bold text-amber-300 mb-4 px-2 leading-relaxed">
          {twist.headline}
        </h3>

        <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-xl mx-auto mb-6 px-2 font-medium">
          {twist.details}
        </p>

        <div className="inline-block bg-white/10 px-4 py-2 text-xs sm:text-sm text-amber-200 font-semibold mb-8">
          {twist.highlightText}
        </div>

        {isHost ? (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onHostStartTimer}
              className="pixel-btn px-8 py-4 bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-base tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <PixelPointerHand className="w-5 h-5 text-amber-300" />
              <span>TIẾP TỤC (30S)</span>
            </button>
            <span className="text-xs text-zinc-400 mt-1 font-medium">
              Bấm để bắt đầu đếm ngược 30 giây cho người chơi điều chỉnh lại cán cân
            </span>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-zinc-300 animate-pulse font-medium">
            {timerRunning
              ? 'Đồng hồ đang chạy! Hãy điều chỉnh lại cán cân của bạn!'
              : 'Đang chờ Quản trò bấm TIẾP TỤC để phân bổ lại tiền...'}
          </div>
        )}
      </div>
    </div>
  );
}
