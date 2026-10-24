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
  const rationalCoinCount = Math.round(rational / 10);

  return (
    <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto select-none pt-3 pb-4">
      {/* Dynamic Numbers Readout - Scaled up for strong presence */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <PixelBrain className="w-7 h-7 sm:w-9 sm:h-9 text-blue-600 shrink-0" />
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-black text-blue-700">
              {rational} GIÁ
            </div>
            <div className="text-xs sm:text-sm text-zinc-700 font-bold">
              Lý trí (Trị dứt điểm 1 người)
            </div>
          </div>
        </div>

        <div className="text-zinc-300 font-light text-2xl sm:text-3xl">/</div>

        <div className="flex items-center gap-3 text-right">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black text-red-600">
              {emotional} GIÁ
            </div>
            <div className="text-xs sm:text-sm text-zinc-700 font-bold">
              Tình cảm (Trị cầm chừng cả 2)
            </div>
          </div>
          <PixelHeart className="w-7 h-7 sm:w-9 sm:h-9 text-red-600 shrink-0" />
        </div>
      </div>

      {/* Tactile Range Slider - Scaled up track */}
      <div className="relative flex items-center my-4 px-1">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={rational}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-6 sm:h-7 bg-zinc-200 rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_0_0_#18181B]"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${rational}%, #DC2626 ${rational}%, #DC2626 100%)`,
          }}
        />
      </div>

      {/* 10 Step Indicator Ticks */}
      <div className="flex justify-between px-2 text-xs sm:text-sm font-mono font-bold text-zinc-600">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
          <span
            key={step}
            onClick={() => !disabled && onChange(step)}
            className={`cursor-pointer transition-transform ${
              rational === step ? 'font-black text-[#18181B] scale-125' : 'hover:text-black'
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* 10 Interactive Coins (Total 100 Giá, 10 Giá/xu) - Scaled up, clean */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap p-3.5 mt-5 bg-zinc-50 border-2 border-zinc-200 shadow-[0_2px_0_0_#18181B]">
        {Array.from({ length: 10 }).map((_, idx) => {
          const isRational = idx < rationalCoinCount;
          return (
            <div
              key={idx}
              onClick={() => !disabled && onChange((idx + 1) * 10)}
              className={`cursor-pointer transition-transform hover:scale-125 p-1 ${
                isRational ? 'opacity-100 scale-105' : 'opacity-65'
              }`}
              title={isRational ? `Xu #${idx + 1}: 10 Giá Lý trí (Xanh)` : `Xu #${idx + 1}: 10 Giá Tình cảm (Đỏ)`}
            >
              <PixelCoin
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-sm"
                value={10}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
