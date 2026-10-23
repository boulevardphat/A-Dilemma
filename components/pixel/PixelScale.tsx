'use client';

import React from 'react';
import { PixelCoin, PixelBrain, PixelHeart } from './PixelIcons';

interface PixelScaleProps {
  rationalAmount: number;
  emotionalAmount: number;
  tiltAngle: number;
  size?: 'sm' | 'md' | 'lg';
  showCoins?: boolean;
}

export function PixelScale({
  rationalAmount,
  emotionalAmount,
  tiltAngle,
  size = 'md',
  showCoins = true,
}: PixelScaleProps) {
  const rationalCoins = Math.min(10, Math.round(rationalAmount / 10));
  const emotionalCoins = Math.min(10, Math.round(emotionalAmount / 10));

  // Tame tilt angle to max +/- 16 deg so the lowest pan never clips or overlaps below
  const safeTilt = Math.max(-16, Math.min(16, tiltAngle * 0.64));

  const scaleWidth = size === 'lg' ? 'w-full max-w-3xl' : size === 'sm' ? 'w-full max-w-sm' : 'w-full max-w-lg';
  const beamHeight = size === 'lg' ? 'h-6' : size === 'sm' ? 'h-3.5' : 'h-5';
  const chainLength = size === 'lg' ? 'h-20' : size === 'sm' ? 'h-12' : 'h-16';
  const panWidth = size === 'lg' ? 'w-44' : size === 'sm' ? 'w-24' : 'w-36';
  const containerHeight = size === 'lg' ? 'h-72 md:h-80' : size === 'sm' ? 'h-56' : 'h-64 md:h-72';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-1 pb-4`}>
      {/* Physical Scale Assembly with Safe Vertical Room */}
      <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-visible`}>
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-5 h-5 bg-amber-500 border-2 border-[#18181B] rotate-45 mb-[-10px] z-20" />

          {/* Vertical Shaft */}
          <div className="w-4 h-36 md:h-44 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 border-x-2 border-[#18181B] flex flex-col justify-around items-center">
            <div className="w-2 h-1 bg-amber-200" />
            <div className="w-2 h-1 bg-amber-900" />
            <div className="w-2 h-1 bg-amber-200" />
          </div>

          {/* Stepped Pedestal Base */}
          <div className="w-20 h-3.5 bg-amber-700 border-2 border-[#18181B]" />
          <div className="w-32 h-5 bg-[#18181B] flex items-center justify-center">
            <span className="text-[8px] text-amber-300 font-mono tracking-widest font-extrabold">
              ĐẠI LỘ
            </span>
          </div>
        </div>

        {/* Rotating Crossbeam Assembly */}
        <div
          className="relative w-full max-w-[94%] transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${safeTilt}deg)` }}
        >
          {/* Horizontal Brass Beam */}
          <div
            className={`w-full ${beamHeight} bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 border-2 border-[#18181B] flex items-center justify-between px-3 shadow-[0_2px_0_0_#18181B]`}
          >
            <div className="w-3 h-3 bg-[#18181B]" />
            <div className="w-6 h-6 bg-[#18181B] flex items-center justify-center">
              <div
                className="w-1.5 h-3.5 bg-amber-300 transition-transform duration-200"
                style={{ transform: `rotate(${-safeTilt * 1.5}deg)` }}
              />
            </div>
            <div className="w-3 h-3 bg-[#18181B]" />
          </div>

          {/* Left Pan (Rational) */}
          <div className="absolute left-2 top-full flex flex-col items-center">
            {/* Hanging Chains */}
            <div className={`${chainLength} flex justify-between w-14 px-1`}>
              <div className="w-0.5 h-full bg-[#18181B]" />
              <div className="w-0.5 h-full bg-[#18181B]" />
            </div>

            {/* Counter-rotating Left Pan */}
            <div
              className={`${panWidth} transition-transform duration-300 ease-out flex flex-col items-center`}
              style={{ transform: `rotate(${-safeTilt}deg)` }}
            >
              {showCoins && (
                <div className="min-h-9 flex flex-wrap-reverse justify-center items-end gap-0.5 pb-1">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <PixelCoin key={i} className="w-6 h-6 drop-shadow-sm" />
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1">0 xu</span>
                  )}
                </div>
              )}

              {/* Blue Dish Shape */}
              <div className="w-full bg-blue-600 border-2 border-[#18181B] border-t-0 p-1.5 text-center text-white shadow-[0_2px_0_0_#1e3a8a]">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <PixelBrain className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-tight">LÝ TRÍ</span>
                </div>
                <div className="text-[10px] font-semibold text-blue-100">
                  {rationalAmount} Giá
                </div>
              </div>
            </div>
          </div>

          {/* Right Pan (Emotional) */}
          <div className="absolute right-2 top-full flex flex-col items-center">
            {/* Hanging Chains */}
            <div className={`${chainLength} flex justify-between w-14 px-1`}>
              <div className="w-0.5 h-full bg-[#18181B]" />
              <div className="w-0.5 h-full bg-[#18181B]" />
            </div>

            {/* Counter-rotating Right Pan */}
            <div
              className={`${panWidth} transition-transform duration-300 ease-out flex flex-col items-center`}
              style={{ transform: `rotate(${-safeTilt}deg)` }}
            >
              {showCoins && (
                <div className="min-h-9 flex flex-wrap-reverse justify-center items-end gap-0.5 pb-1">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <PixelCoin key={i} className="w-6 h-6 drop-shadow-sm" />
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1">0 xu</span>
                  )}
                </div>
              )}

              {/* Red Dish Shape */}
              <div className="w-full bg-red-600 border-2 border-[#18181B] border-t-0 p-1.5 text-center text-white shadow-[0_2px_0_0_#7f1d1d]">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <PixelHeart className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-tight">TÌNH CẢM</span>
                </div>
                <div className="text-[10px] font-semibold text-red-100">
                  {emotionalAmount} Giá
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
