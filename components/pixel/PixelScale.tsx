'use client';

import React from 'react';
import { PixelCoin } from './PixelIcons';

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

  // Tame tilt angle to max +/- 16 deg so the beam tilts smoothly without extreme distortion
  const safeTilt = Math.max(-16, Math.min(16, tiltAngle * 0.64));

  const scaleWidth =
    size === 'lg' ? 'w-full max-w-3xl' : size === 'sm' ? 'w-full max-w-sm' : 'w-full max-w-xl';
  const beamHeight = size === 'lg' ? 'h-6' : size === 'sm' ? 'h-4' : 'h-5';
  const panWidth = size === 'lg' ? 'w-36 md:w-44' : size === 'sm' ? 'w-24' : 'w-28 sm:w-32';
  const containerHeight = size === 'lg' ? 'h-56 md:h-64' : size === 'sm' ? 'h-40' : 'h-48 sm:h-52';
  const coinSize =
    size === 'lg' ? 'w-6 h-6 sm:w-7 sm:h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-1 pb-2`}>
      {/* Physical Scale Assembly - Clean & Compact without hanging chains */}
      <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-visible`}>
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-5 h-5 bg-amber-500 border-2 border-[#18181B] rotate-45 mb-[-10px] z-20" />

          {/* Vertical Shaft */}
          <div className="w-4 h-28 sm:h-32 md:h-36 bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 border-x-2 border-[#18181B] flex flex-col justify-around items-center">
            <div className="w-2 h-1 bg-amber-200" />
            <div className="w-2 h-1 bg-amber-900" />
            <div className="w-2 h-1 bg-amber-200" />
          </div>

          {/* Stepped Pedestal Base */}
          <div className="w-20 h-3 bg-amber-700 border-2 border-[#18181B]" />
          <div className="w-32 h-5 bg-[#18181B] flex items-center justify-center">
            <span className="text-[8px] text-amber-300 font-mono tracking-widest font-extrabold">
              ĐẠI LỘ
            </span>
          </div>
        </div>

        {/* Rotating Crossbeam Assembly */}
        <div
          className="relative w-full max-w-[92%] transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${safeTilt}deg)` }}
        >
          {/* LEFT SIDE: Rational Platform & Coins resting directly ON the beam */}
          <div className="absolute left-2 sm:left-4 bottom-full mb-1 flex flex-col items-center">
            {/* Upright Stack of Coins on top of beam */}
            <div
              className={`${panWidth} transition-transform duration-300 ease-out flex flex-col items-center`}
              style={{ transform: `rotate(${-safeTilt}deg)` }}
            >
              {showCoins && (
                <div className="min-h-9 flex flex-wrap-reverse justify-center items-end gap-1 pb-1">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <PixelCoin key={i} className={`${coinSize} drop-shadow-sm`} />
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam */}
            <div
              className={`${panWidth} h-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-2 border-[#18181B] flex justify-between items-center px-1 shadow-[0_2px_0_0_#18181B]`}
            >
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-2 h-1 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>

          {/* The Horizontal Brass Crossbeam */}
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

          {/* RIGHT SIDE: Emotional Platform & Coins resting directly ON the beam */}
          <div className="absolute right-2 sm:right-4 bottom-full mb-1 flex flex-col items-center">
            {/* Upright Stack of Coins on top of beam */}
            <div
              className={`${panWidth} transition-transform duration-300 ease-out flex flex-col items-center`}
              style={{ transform: `rotate(${-safeTilt}deg)` }}
            >
              {showCoins && (
                <div className="min-h-9 flex flex-wrap-reverse justify-center items-end gap-1 pb-1">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <PixelCoin key={i} className={`${coinSize} drop-shadow-sm`} />
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam */}
            <div
              className={`${panWidth} h-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 border-2 border-[#18181B] flex justify-between items-center px-1 shadow-[0_2px_0_0_#18181B]`}
            >
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-2 h-1 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>
        </div>
      </div>
    </div>
  );
}
