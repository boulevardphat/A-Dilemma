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
    <div className="w-full select-none pt-2 pb-4">
      {/* Dynamic Numbers Readout - Unboxed, breathable */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <PixelBrain className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-sm font-bold text-blue-700 tracking-wide">
              {rational} GIÁ
            </span>
            <div className="text-[11px] text-zinc-500 font-medium">Lý trí (Dứt điểm 1 người)</div>
          </div>
        </div>

        <div className="text-zinc-400 font-light text-base">/</div>

        <div className="flex items-center gap-1.5 text-right">
          <div>
            <span className="text-sm font-bold text-red-600 tracking-wide">
              {emotional} GIÁ
            </span>
            <div className="text-[11px] text-zinc-500 font-medium">Tình cảm (Cầm chừng cả 2)</div>
          </div>
          <PixelHeart className="w-5 h-5 text-red-600" />
        </div>
      </div>

      {/* Tactile Range Slider */}
      <div className="relative flex items-center my-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={rational}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-zinc-200 rounded-none appearance-none cursor-pointer border border-[#18181B] accent-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${rational}%, #DC2626 ${rational}%, #DC2626 100%)`,
          }}
        />
      </div>

      {/* 10 Step Indicator Ticks */}
      <div className="flex justify-between px-1.5 text-[9px] font-mono text-zinc-400">
        {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((step) => (
          <span
            key={step}
            onClick={() => !disabled && onChange(step)}
            className={`cursor-pointer transition-colors ${
              rational === step ? 'font-bold text-[#18181B]' : 'hover:text-zinc-600'
            }`}
          >
            {step}
          </span>
        ))}
      </div>

      {/* 10 Visual Coins Representation - Unboxed */}
      <div className="flex items-center justify-center gap-1 mt-4">
        {Array.from({ length: 10 }).map((_, idx) => {
          const isRational = idx < rational / 10;
          return (
            <div
              key={idx}
              onClick={() => !disabled && onChange((idx + 1) * 10)}
              className={`cursor-pointer transition-transform hover:scale-110 p-0.5 ${
                isRational ? 'opacity-100' : 'opacity-85'
              }`}
              title={isRational ? '10 Giá Lý trí' : '10 Giá Tình cảm'}
            >
              <PixelCoin className="w-5 h-5" value={10} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
