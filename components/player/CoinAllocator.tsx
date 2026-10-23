'use client';

import React from 'react';
import { PixelCoin, PixelBrain, PixelHeart } from '../pixel/PixelIcons';

interface CoinAllocatorProps {
  rational: number; // 0 to 100
  onChange: (rational: number) => void;
  disabled?: boolean;
}

export function CoinAllocator({ rational, onChange, disabled = false }: CoinAllocatorProps) {
  const emotional = 100 - rational;
  const rationalCoins = Math.round(rational / 10);
  const emotionalCoins = 10 - rationalCoins;

  const handleAdjust = (deltaToRational: number) => {
    if (disabled) return;
    const newRational = Math.max(0, Math.min(100, rational + deltaToRational));
    onChange(newRational);
  };

  const handleSetPreset = (presetRational: number) => {
    if (disabled) return;
    onChange(presetRational);
  };

  return (
    <div className="w-full bg-[#181C28] border-2 border-black p-3 md:p-4 shadow-[0_4px_0_0_#000]">
      {/* Tray Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <PixelCoin className="w-5 h-5" />
          <span className="text-[10px] font-pixel text-amber-300">
            100 GIÁ ĐẠI LỘ (10 ĐỒNG XU)
          </span>
        </div>
        <span className="text-[9px] font-pixel text-slate-400">
          {disabled ? 'ĐÃ KHÓA' : 'CHỌN ĐĨA CÂN'}
        </span>
      </div>

      {/* Visual Coin Strip: 10 coins colored by side */}
      <div className="bg-[#0D1017] border border-black p-2 mb-4 flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {Array.from({ length: 10 }).map((_, index) => {
          const isRational = index < rationalCoins;
          return (
            <div
              key={index}
              onClick={() => {
                if (disabled) return;
                // Click on a coin to set cut-off point
                onChange((index + 1) * 10);
              }}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-110 p-1 border ${
                isRational
                  ? 'border-blue-500 bg-blue-950/70 shadow-[0_2px_0_0_#1e3a8a]'
                  : 'border-red-500 bg-red-950/70 shadow-[0_2px_0_0_#7f1d1d]'
              }`}
              title={isRational ? 'Đồng xu Lý trí (10 giá)' : 'Đồng xu Tình cảm (10 giá)'}
            >
              <PixelCoin className="w-5 h-5 sm:w-6 sm:h-6" value={10} />
            </div>
          );
        })}
      </div>

      {/* 2-Side Interactive Allocation Steppers */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Left Side: Rational Controls */}
        <div className="bg-blue-950/40 border-2 border-blue-600 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PixelBrain className="w-4 h-4" />
              <span className="text-[10px] font-pixel text-blue-300">LÝ TRÍ</span>
            </div>
            <span className="text-xs font-pixel font-bold text-blue-200">
              {rational} GIÁ
            </span>
          </div>

          <div className="text-[11px] text-slate-300 mb-2 leading-relaxed">
            Trị dứt điểm 1 người bệnh (ưu tiên thực tế, chắc chắn)
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              type="button"
              disabled={disabled || rational <= 0}
              onClick={() => handleAdjust(-10)}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-black font-pixel text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_0_0_#000]"
            >
              -10
            </button>
            <button
              type="button"
              disabled={disabled || rational >= 100}
              onClick={() => handleAdjust(10)}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 border border-black font-pixel text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_0_0_#1e3a8a]"
            >
              +10
            </button>
          </div>
        </div>

        {/* Right Side: Emotional Controls */}
        <div className="bg-red-950/40 border-2 border-red-600 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <PixelHeart className="w-4 h-4" />
              <span className="text-[10px] font-pixel text-red-300">TÌNH CẢM</span>
            </div>
            <span className="text-xs font-pixel font-bold text-red-200">
              {emotional} GIÁ
            </span>
          </div>

          <div className="text-[11px] text-slate-300 mb-2 leading-relaxed">
            Trị cầm chừng cả 2 người (ưu tiên tình cảm, chấp nhận rủi ro)
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <button
              type="button"
              disabled={disabled || emotional <= 0}
              onClick={() => handleAdjust(10)}
              className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-black font-pixel text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_0_0_#000]"
            >
              -10
            </button>
            <button
              type="button"
              disabled={disabled || emotional >= 100}
              onClick={() => handleAdjust(-10)}
              className="flex-1 py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 border border-black font-pixel text-xs text-white disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_2px_0_0_#7f1d1d]"
            >
              +10
            </button>
          </div>
        </div>
      </div>

      {/* Fast Presets */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap pt-2 border-t border-slate-800">
        <span className="text-[9px] font-pixel text-slate-400">CHỌN NHANH:</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSetPreset(100)}
            className="px-2 py-1 bg-blue-900/60 hover:bg-blue-800 border border-blue-500 font-pixel text-[9px] text-blue-200"
          >
            100% LÝ TRÍ
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSetPreset(50)}
            className="px-2 py-1 bg-amber-900/60 hover:bg-amber-800 border border-amber-500 font-pixel text-[9px] text-amber-200"
          >
            50 : 50 HUỀ
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSetPreset(0)}
            className="px-2 py-1 bg-red-900/60 hover:bg-red-800 border border-red-500 font-pixel text-[9px] text-red-200"
          >
            100% TÌNH CẢM
          </button>
        </div>
      </div>
    </div>
  );
}
