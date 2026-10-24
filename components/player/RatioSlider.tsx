'use client';

import React, { useState } from 'react';
import { PixelBrain, PixelHeart, PixelCoin } from '../pixel/PixelIcons';

export type CoinDensityType = 'standard' | 'rich' | 'party';

interface RatioSliderProps {
  rational: number; // 0 to 100
  onChange: (val: number) => void;
  disabled?: boolean;
  coinDensity?: CoinDensityType;
  onCoinDensityChange?: (val: CoinDensityType) => void;
}

export function RatioSlider({
  rational,
  onChange,
  disabled = false,
  coinDensity: externalDensity,
  onCoinDensityChange,
}: RatioSliderProps) {
  const [internalDensity, setInternalDensity] = useState<CoinDensityType>('rich');
  const currentDensity = externalDensity ?? internalDensity;

  const handleDensityChange = (density: CoinDensityType) => {
    setInternalDensity(density);
    onCoinDensityChange?.(density);
  };

  const emotional = 100 - rational;

  // Determine total coins to show in the interactive strip:
  // - 'standard': 10 coins (10 Giá/coin)
  // - 'rich': 20 coins (5 Giá/coin) -> More than 10 coins!
  // - 'party': 30 coins (~3.33 Giá/coin)
  const totalCoins = currentDensity === 'standard' ? 10 : currentDensity === 'party' ? 30 : 20;
  const ptsPerCoin = 100 / totalCoins;
  const rationalCoinCount = Math.round(rational / ptsPerCoin);

  return (
    <div className="w-full max-w-xl mx-auto select-none pt-2 pb-5 mt-2">
      {/* Dynamic Numbers Readout - Big, airy */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <PixelBrain className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <div className="text-base sm:text-lg font-black text-blue-700">
              {rational} GIÁ
            </div>
            <div className="text-xs text-zinc-600 font-medium">Lý trí (Trị dứt điểm 1 người)</div>
          </div>
        </div>

        <div className="text-zinc-300 font-light text-xl">/</div>

        <div className="flex items-center gap-2 text-right">
          <div>
            <div className="text-base sm:text-lg font-black text-red-600">
              {emotional} GIÁ
            </div>
            <div className="text-xs text-zinc-600 font-medium">Tình cảm (Trị cầm chừng cả 2)</div>
          </div>
          <PixelHeart className="w-6 h-6 text-red-600 shrink-0" />
        </div>
      </div>

      {/* Tactile Range Slider - Clean Borderless Track */}
      <div className="relative flex items-center my-3 px-1">
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={rational}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-4 sm:h-5 bg-zinc-200 rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${rational}%, #DC2626 ${rational}%, #DC2626 100%)`,
          }}
        />
      </div>

      {/* Step Indicator Ticks */}
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

      {/* Coin Mode Selector: 10 xu vs 20 xu vs 30 xu */}
      <div className="flex items-center justify-between mt-5 mb-2 px-1 text-xs">
        <span className="text-zinc-500 font-medium">
          Số lượng đồng xu: <span className="font-bold text-[#18181B]">{totalCoins} xu</span>{' '}
          ({ptsPerCoin % 1 === 0 ? ptsPerCoin : ptsPerCoin.toFixed(1)} Giá/xu)
        </span>
        <div className="inline-flex rounded-sm bg-zinc-100 p-0.5 gap-1">
          <button
            type="button"
            onClick={() => handleDensityChange('standard')}
            className={`px-2 py-0.5 text-[10px] font-bold transition-all ${
              currentDensity === 'standard'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            10 xu
          </button>
          <button
            type="button"
            onClick={() => handleDensityChange('rich')}
            className={`px-2 py-0.5 text-[10px] font-bold transition-all ${
              currentDensity === 'rich'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            20 xu ★
          </button>
          <button
            type="button"
            onClick={() => handleDensityChange('party')}
            className={`px-2 py-0.5 text-[10px] font-bold transition-all ${
              currentDensity === 'party'
                ? 'bg-[#18181B] text-white shadow-xs'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            30 xu
          </button>
        </div>
      </div>

      {/* Interactive Visual Coins Strip - Supports >10 coins */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5 flex-wrap p-2 bg-zinc-50 border border-zinc-200">
        {Array.from({ length: totalCoins }).map((_, idx) => {
          const isRational = idx < rationalCoinCount;
          const coinStepVal = Math.round((idx + 1) * ptsPerCoin);
          return (
            <div
              key={idx}
              onClick={() => !disabled && onChange(coinStepVal)}
              className={`cursor-pointer transition-transform hover:scale-125 p-0.5 ${
                isRational ? 'opacity-100 scale-105' : 'opacity-70'
              }`}
              title={`Xu #${idx + 1}: ${isRational ? 'Lý trí (Xanh)' : 'Tình cảm (Đỏ)'}`}
            >
              <PixelCoin
                className={`${
                  totalCoins > 20
                    ? 'w-4 h-4 sm:w-5 sm:h-5'
                    : totalCoins > 10
                    ? 'w-5 h-5 sm:w-6 sm:h-6'
                    : 'w-6 h-6 sm:w-7 sm:h-7'
                } drop-shadow-xs`}
                value={currentDensity === 'standard' ? 10 : currentDensity === 'rich' ? 5 : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
