'use client';

import React from 'react';
import { PixelBrain, PixelHeart, PixelCoin } from '../pixel/PixelIcons';
import { sound } from '@/lib/sound';

interface RatioSliderProps {
  rational: number; // 0 to 100
  onChange: (val: number) => void;
  disabled?: boolean;
}

export function RatioSlider({ rational, onChange, disabled = false }: RatioSliderProps) {
  const emotional = 100 - rational;
  const rationalCoinCount = Math.round(rational / 10);

  return (
    <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto select-none pt-1 sm:pt-3 pb-2 sm:pb-4 px-1">
      {/* Numbers Readout - Clean and responsive on mobile */}
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3 text-left">
          <PixelBrain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
          <div>
            <div className="text-xl sm:text-3xl font-black text-blue-700 leading-tight">
              {rational} GIÁ
            </div>
            <div className="text-[10px] sm:text-xs text-zinc-600 font-bold">
              LÝ TRÍ <span className="hidden sm:inline font-normal">· Trị dứt điểm 1 người</span>
            </div>
          </div>
        </div>

        <div className="text-zinc-300 font-light text-xl sm:text-3xl px-1">/</div>

        <div className="flex items-center gap-2 sm:gap-3 text-right">
          <div>
            <div className="text-xl sm:text-3xl font-black text-red-600 leading-tight">
              {emotional} GIÁ
            </div>
            <div className="text-[10px] sm:text-xs text-zinc-600 font-bold">
              TÌNH CẢM <span className="hidden sm:inline font-normal">· Trị cầm chừng cả 2</span>
            </div>
          </div>
          <PixelHeart className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 shrink-0" />
        </div>
      </div>

      {/* Tactile Range Slider */}
      <div className="relative flex items-center my-2 sm:my-4">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={rational}
          disabled={disabled}
          onChange={(e) => {
            sound.playSliderTick();
            onChange(Number(e.target.value));
          }}
          className="w-full h-5 sm:h-7 bg-zinc-200 rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_0_0_#18181B]"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${rational}%, #DC2626 ${rational}%, #DC2626 100%)`,
          }}
        />
      </div>

      {/* 10 Step Indicator Ticks */}
      <div className="flex justify-between px-1 text-[10px] sm:text-xs font-mono font-bold text-zinc-600">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
          <span
            key={step}
            onClick={() => {
              if (!disabled) {
                sound.playSliderTick();
                onChange(step);
              }
            }}
            className={`cursor-pointer transition-transform ${
              rational === step ? 'font-black text-[#18181B] scale-125' : 'hover:text-black'
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* 10 Interactive Coins (Total 100 Giá, 10 Giá/xu) - Fits in 1 line on mobile */}
      <div className="flex items-center justify-center gap-1 sm:gap-2.5 p-2 sm:p-3 mt-3 sm:mt-5 bg-zinc-50 border-2 border-zinc-200 shadow-[0_2px_0_0_#18181B] overflow-x-auto">
        {Array.from({ length: 10 }).map((_, idx) => {
          const isRational = idx < rationalCoinCount;
          return (
            <div
              key={idx}
              onClick={() => {
                if (!disabled) {
                  sound.playCoin();
                  onChange((idx + 1) * 10);
                }
              }}
              className={`cursor-pointer transition-transform hover:scale-125 p-0.5 shrink-0 ${
                isRational ? 'opacity-100 scale-105' : 'opacity-60'
              }`}
              title={isRational ? `Xu #${idx + 1}: 10 Giá Lý trí (Xanh)` : `Xu #${idx + 1}: 10 Giá Tình cảm (Đỏ)`}
            >
              <PixelCoin
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 drop-shadow-xs"
                value={10}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
