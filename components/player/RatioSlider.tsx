'use client';

import React from 'react';
import { PixelBrain, PixelHeart, PixelCoin } from '../pixel/PixelIcons';

interface RatioSliderProps {
  rational: number; // 0 to 100
  onChange: (val: number) => void;
  disabled?: boolean;
}

export function RatioSlider({ rational, onChange, disabled = false }: RatioSliderProps) {
  const emotional = 100 - rational;

  return (
    <div className="w-full max-w-xl mx-auto select-none pt-4 pb-6 mt-4">
      {/* Dynamic Numbers Readout - Big, airy */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-2">
          <PixelBrain className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <div className="text-base sm:text-lg font-black text-blue-700 tracking-tight">
              {rational} GIÁ
            </div>
            <div className="text-xs text-zinc-600 font-medium">Lý trí (Trị dứt điểm 1 người)</div>
          </div>
        </div>

        <div className="text-zinc-300 font-light text-xl">/</div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="text-base sm:text-lg font-black text-red-600 tracking-tight">
              {emotional} GIÁ
            </div>
            <div className="text-xs text-zinc-600 font-medium">Tình cảm (Trị cầm chừng cả 2)</div>
          </div>
          <PixelHeart className="w-6 h-6 text-red-600 shrink-0" />
        </div>
      </div>

      {/* Tactile Range Slider - Enlarged Track and Controls */}
      <div className="relative flex items-center my-4 px-1">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={rational}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-4 sm:h-5 bg-zinc-200 rounded-none appearance-none cursor-pointer border-2 border-[#18181B] accent-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_0_0_#18181B]"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${rational}%, #DC2626 ${rational}%, #DC2626 100%)`,
          }}
        />
      </div>

      {/* 10 Step Indicator Ticks */}
      <div className="flex justify-between px-1.5 text-[10px] sm:text-xs font-mono font-medium text-zinc-500">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
          <span
            key={step}
            onClick={() => !disabled && onChange(step)}
            className={`cursor-pointer transition-colors ${
              rational === step ? 'font-bold text-[#18181B] scale-110' : 'hover:text-zinc-800'
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* 10 Visual Coins Representation - Larger & Interactive */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6">
        {Array.from({ length: 10 }).map((_, idx) => {
          const isRational = idx < rational / 10;
          return (
            <div
              key={idx}
              onClick={() => !disabled && onChange((idx + 1) * 10)}
              className={`cursor-pointer transition-transform hover:scale-125 p-0.5 ${
                isRational ? 'opacity-100' : 'opacity-85'
              }`}
              title={isRational ? '10 Giá Lý trí' : '10 Giá Tình cảm'}
            >
              <PixelCoin className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-sm" value={10} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
