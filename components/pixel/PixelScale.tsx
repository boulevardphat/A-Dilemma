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
  // Real coin count: 1 coin = 10 Giá Đại lộ
  // Unlimited coins - stacks up to 50, 100+ as more players join and vote!
  const total = rationalAmount + emotionalAmount;
  let rationalCoins = 5;
  let emotionalCoins = 5;

  if (total > 0) {
    rationalCoins = Math.round(rationalAmount / 10);
    emotionalCoins = Math.round(emotionalAmount / 10);
  }

  // Tame tilt angle to max +/- 15 deg so the beam tilts smoothly without extreme distortion
  const safeTilt = Math.max(-15, Math.min(15, tiltAngle * 0.6));

  // Responsive container width
  const scaleWidth =
    size === 'lg'
      ? 'w-full max-w-4xl'
      : size === 'sm'
      ? 'w-full max-w-xs sm:max-w-sm'
      : 'w-full max-w-xs sm:max-w-xl md:max-w-2xl';

  // Crossbeam height
  const beamHeight = size === 'lg' ? 'h-6 sm:h-8' : size === 'sm' ? 'h-4 sm:h-5' : 'h-5 sm:h-6';

  // Wide pan so coins can stack in columns
  const panWidth =
    size === 'lg'
      ? 'w-44 sm:w-56 md:w-64'
      : size === 'sm'
      ? 'w-24 sm:w-28'
      : 'w-28 sm:w-40 md:w-48';

  // Height of scale assembly with extra headroom for massive coin stacks
  const containerHeight =
    size === 'lg'
      ? 'h-72 sm:h-96 md:h-[440px]'
      : size === 'sm'
      ? 'h-44 sm:h-52'
      : 'h-56 sm:h-72 md:h-80';

  // Central fulcrum pillar height
  const pillarHeight =
    size === 'lg'
      ? 'h-36 sm:h-48 md:h-56'
      : size === 'sm'
      ? 'h-20 sm:h-26'
      : 'h-28 sm:h-36 md:h-42';

  // Responsive coin size
  const coinWidthClass =
    size === 'lg'
      ? 'w-6 h-6 sm:w-8 sm:h-8'
      : size === 'sm'
      ? 'w-4 h-4 sm:w-5 sm:h-5'
      : 'w-5 h-5 sm:w-6 sm:h-6';

  // Column count for stacks
  const numCols = size === 'lg' ? 5 : size === 'sm' ? 3 : 4;

  // Helper to render realistic stacked arcade coin piles
  const renderCoinStack = (count: number, isLeft: boolean) => {
    if (!showCoins) return null;

    if (count === 0) {
      return (
        <span className="text-[10px] text-zinc-400 py-1 font-mono font-bold">
          0 xu
        </span>
      );
    }

    // Cap visual rendering to 45 coins for max performance and crisp layout, but show actual total
    const visualCount = Math.min(count, 45);
    const columns: number[] = Array(numCols).fill(0);

    for (let i = 0; i < visualCount; i++) {
      columns[i % numCols]++;
    }

    return (
      <div className="flex flex-col items-center justify-end">
        {/* Multi-column vertical overlapping stack */}
        <div className="flex items-end justify-center gap-0.5 sm:gap-1 pb-0.5">
          {columns.map((colCount, colIdx) => {
            if (colCount === 0) return null;
            return (
              <div key={colIdx} className="flex flex-col-reverse items-center">
                {Array.from({ length: colCount }).map((_, coinIdx) => (
                  <div
                    key={coinIdx}
                    className={`transition-transform duration-200 hover:scale-125 ${
                      coinIdx > 0 ? '-mb-3 sm:-mb-4' : ''
                    }`}
                    style={{
                      zIndex: coinIdx,
                    }}
                  >
                    <PixelCoin
                      value={10}
                      className={`${coinWidthClass} drop-shadow-xs`}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          {/* Counter-rotate by -safeTilt so the pan and stacked coins stay upright with gravity */}
          <div
            className="absolute left-0 bottom-full mb-0 flex flex-col items-center origin-bottom transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-safeTilt}deg)` }}
          >
            {/* Stacking coins pile */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom min-h-12`}>
              {renderCoinStack(rationalCoins, true)}
            </div>

            {/* Brass Tray / Pan seated solidly */}
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
          {/* Counter-rotate by -safeTilt so the pan and stacked coins stay upright with gravity */}
          <div
            className="absolute right-0 bottom-full mb-0 flex flex-col items-center origin-bottom transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${-safeTilt}deg)` }}
          >
            {/* Stacking coins pile */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom min-h-12`}>
              {renderCoinStack(emotionalCoins, false)}
            </div>

            {/* Brass Tray / Pan seated solidly */}
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
