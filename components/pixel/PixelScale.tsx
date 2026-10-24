'use client';

import React from 'react';
import { PixelCoin } from './PixelIcons';

export interface PixelScaleProps {
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
  // Exactly 10 coins total representing 100 Giá (1 coin = 10 Giá)
  const total = rationalAmount + emotionalAmount;
  let rationalCoins = 5;
  let emotionalCoins = 5;

  if (total > 0) {
    rationalCoins = Math.max(0, Math.min(10, Math.round((rationalAmount / total) * 10)));
    emotionalCoins = 10 - rationalCoins;
  }

  // Tame tilt angle to max +/- 15 deg so the beam tilts smoothly without extreme distortion
  const safeTilt = Math.max(-15, Math.min(15, tiltAngle * 0.6));

  // Responsive container width: roomy on desktop, never cramped on mobile
  const scaleWidth =
    size === 'lg'
      ? 'w-full max-w-4xl'
      : size === 'sm'
      ? 'w-full max-w-xs sm:max-w-sm'
      : 'w-full max-w-xs sm:max-w-xl md:max-w-2xl';

  // Crossbeam height
  const beamHeight = size === 'lg' ? 'h-6 sm:h-8' : size === 'sm' ? 'h-4 sm:h-5' : 'h-5 sm:h-6';

  // Compact pan width so left and right trays NEVER collide in the center on mobile
  const panWidth =
    size === 'lg'
      ? 'w-36 sm:w-48 md:w-56'
      : size === 'sm'
      ? 'w-20 sm:w-24'
      : 'w-22 sm:w-32 md:w-40';

  // Container height with plenty of vertical breathing room
  const containerHeight =
    size === 'lg'
      ? 'h-64 sm:h-80 md:h-96'
      : size === 'sm'
      ? 'h-40 sm:h-48'
      : 'h-48 sm:h-60 md:h-72';

  // Central fulcrum pillar height
  const pillarHeight =
    size === 'lg'
      ? 'h-32 sm:h-44 md:h-52'
      : size === 'sm'
      ? 'h-18 sm:h-24'
      : 'h-24 sm:h-32 md:h-38';

  // Responsive coin size
  const coinSize =
    size === 'lg'
      ? 'w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11'
      : size === 'sm'
      ? 'w-5 h-5 sm:w-6 sm:h-6'
      : 'w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-1 sm:my-2 px-1`}>
      {/* Physical Scale Assembly */}
      <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-visible`}>
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 border-2 border-[#18181B] rotate-45 mb-[-8px] sm:mb-[-10px] z-20" />

          {/* Vertical Shaft */}
          <div
            className={`w-3.5 sm:w-5 ${pillarHeight} bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 border-x-2 border-[#18181B] flex flex-col justify-around items-center`}
          >
            <div className="w-1.5 sm:w-2.5 h-1 bg-amber-200" />
            <div className="w-1.5 sm:w-2.5 h-1 bg-amber-900" />
            <div className="w-1.5 sm:w-2.5 h-1 bg-amber-200" />
          </div>

          {/* Stepped Pedestal Base */}
          <div className="w-20 sm:w-28 md:w-32 h-2.5 sm:h-3.5 bg-amber-700 border-2 border-[#18181B]" />
          <div className="w-28 sm:w-40 md:w-48 h-5 sm:h-6 bg-[#18181B] flex items-center justify-center shadow-[0_2px_0_0_#000]">
            <span className="text-[8px] sm:text-[10px] text-amber-300 font-mono tracking-widest font-black">
              ĐẠI LỘ
            </span>
          </div>
        </div>

        {/* Rotating Crossbeam Assembly - Tilts by safeTilt degrees */}
        <div
          className="relative w-full max-w-[96%] transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${safeTilt}deg)` }}
        >
          {/* LEFT SIDE: Rational Platform & Coins anchored at the FAR LEFT TIP of the beam */}
          <div className="absolute left-0 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack neatly stacked on the tilted tray without spilling into center */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-8 sm:min-h-10 flex flex-wrap-reverse justify-center items-end gap-1 pb-1">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={10}
                      className={`${coinSize} drop-shadow-sm transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam */}
            <div
              className={`${panWidth} h-2.5 sm:h-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-2 border-[#18181B] flex justify-between items-center px-1 shadow-[0_2px_0_0_#18181B]`}
            >
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
              <div className="h-0.5 w-full mx-1 bg-amber-300/60" />
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-2.5 h-1.5 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>

          {/* The Horizontal Brass Crossbeam */}
          <div
            className={`w-full ${beamHeight} bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 border-2 border-[#18181B] flex items-center justify-between px-2 sm:px-3 shadow-[0_2px_0_0_#18181B]`}
          >
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#18181B]" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#18181B] flex items-center justify-center">
              <div
                className="w-1.5 sm:w-2 h-3.5 sm:h-4.5 bg-amber-300 transition-transform duration-200"
                style={{ transform: `rotate(${-safeTilt * 1.5}deg)` }}
              />
            </div>
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#18181B]" />
          </div>

          {/* RIGHT SIDE: Emotional Platform & Coins anchored at the FAR RIGHT TIP of the beam */}
          <div className="absolute right-0 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack neatly stacked on the tilted tray without spilling into center */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-8 sm:min-h-10 flex flex-wrap-reverse justify-center items-end gap-1 pb-1">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={10}
                      className={`${coinSize} drop-shadow-sm transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam */}
            <div
              className={`${panWidth} h-2.5 sm:h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 border-2 border-[#18181B] flex justify-between items-center px-1 shadow-[0_2px_0_0_#18181B]`}
            >
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
              <div className="h-0.5 w-full mx-1 bg-amber-300/60" />
              <div className="w-1.5 h-1.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-2.5 h-1.5 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>
        </div>
      </div>
    </div>
  );
}
