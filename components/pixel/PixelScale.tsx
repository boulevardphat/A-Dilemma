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

  // Tame tilt angle to max +/- 16 deg so the beam tilts smoothly without extreme distortion
  const safeTilt = Math.max(-16, Math.min(16, tiltAngle * 0.64));

  // Enhanced scaling to utilize screen space effectively and prevent empty feeling
  const scaleWidth =
    size === 'lg'
      ? 'w-full max-w-5xl'
      : size === 'sm'
      ? 'w-full max-w-md'
      : 'w-full max-w-2xl sm:max-w-3xl';

  const beamHeight = size === 'lg' ? 'h-8 sm:h-9' : size === 'sm' ? 'h-5' : 'h-6 sm:h-7';
  const panWidth = size === 'lg' ? 'w-56 sm:w-64 md:w-72' : size === 'sm' ? 'w-32' : 'w-44 sm:w-52';
  const containerHeight =
    size === 'lg'
      ? 'h-80 sm:h-96 md:h-[420px]'
      : size === 'sm'
      ? 'h-48'
      : 'h-64 sm:h-72 md:h-80';

  const pillarHeight =
    size === 'lg'
      ? 'h-44 sm:h-52 md:h-60'
      : size === 'sm'
      ? 'h-24'
      : 'h-32 sm:h-38 md:h-42';

  const coinSize =
    size === 'lg'
      ? 'w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12'
      : size === 'sm'
      ? 'w-5 h-5'
      : 'w-8 h-8 sm:w-9 sm:h-9';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-2 pb-2`}>
      {/* Physical Scale Assembly - Scaled up for rich viewport presence */}
      <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-visible`}>
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-6 h-6 bg-amber-500 border-2 border-[#18181B] rotate-45 mb-[-12px] z-20" />

          {/* Vertical Shaft */}
          <div
            className={`w-5 sm:w-6 ${pillarHeight} bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 border-x-2 border-[#18181B] flex flex-col justify-around items-center`}
          >
            <div className="w-3 h-1.5 bg-amber-200" />
            <div className="w-3 h-1.5 bg-amber-900" />
            <div className="w-3 h-1.5 bg-amber-200" />
          </div>

          {/* Stepped Pedestal Base */}
          <div className="w-28 sm:w-36 h-4 bg-amber-700 border-2 border-[#18181B]" />
          <div className="w-40 sm:w-52 h-7 bg-[#18181B] flex items-center justify-center shadow-[0_3px_0_0_#000]">
            <span className="text-[10px] sm:text-xs text-amber-300 font-mono tracking-widest font-black">
              ĐẠI LỘ
            </span>
          </div>
        </div>

        {/* Rotating Crossbeam Assembly - Tilts by safeTilt degrees */}
        <div
          className="relative w-full max-w-[94%] transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${safeTilt}deg)` }}
        >
          {/* LEFT SIDE: Rational Platform & Coins resting directly ON the tray */}
          {/* Coins tilt synchronously with the scale beam */}
          <div className="absolute left-1 sm:left-3 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack resting squarely on the tilted tray */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-12 flex flex-wrap-reverse justify-center items-end gap-1.5 pb-1">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={10}
                      className={`${coinSize} drop-shadow-md transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-xs text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam with retaining lips */}
            <div
              className={`${panWidth} h-3 sm:h-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 border-2 border-[#18181B] flex justify-between items-center px-1.5 shadow-[0_3px_0_0_#18181B]`}
            >
              <div className="w-2 h-2.5 bg-[#18181B]" />
              <div className="h-1 w-full mx-1.5 bg-amber-300/60" />
              <div className="w-2 h-2.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-3.5 h-2 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>

          {/* The Horizontal Brass Crossbeam */}
          <div
            className={`w-full ${beamHeight} bg-gradient-to-b from-amber-300 via-amber-500 to-amber-600 border-2 border-[#18181B] flex items-center justify-between px-3 shadow-[0_3px_0_0_#18181B]`}
          >
            <div className="w-3.5 h-3.5 bg-[#18181B]" />
            <div className="w-8 h-8 bg-[#18181B] flex items-center justify-center">
              <div
                className="w-2 h-5 bg-amber-300 transition-transform duration-200"
                style={{ transform: `rotate(${-safeTilt * 1.5}deg)` }}
              />
            </div>
            <div className="w-3.5 h-3.5 bg-[#18181B]" />
          </div>

          {/* RIGHT SIDE: Emotional Platform & Coins resting directly ON the tray */}
          {/* Coins tilt synchronously with the scale beam */}
          <div className="absolute right-1 sm:right-3 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack resting squarely on the tilted tray */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-12 flex flex-wrap-reverse justify-center items-end gap-1.5 pb-1">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={10}
                      className={`${coinSize} drop-shadow-md transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-xs text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam with retaining lips */}
            <div
              className={`${panWidth} h-3 sm:h-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 border-2 border-[#18181B] flex justify-between items-center px-1.5 shadow-[0_3px_0_0_#18181B]`}
            >
              <div className="w-2 h-2.5 bg-[#18181B]" />
              <div className="h-1 w-full mx-1.5 bg-amber-300/60" />
              <div className="w-2 h-2.5 bg-[#18181B]" />
            </div>
            {/* Small pedestal mount connecting tray to the beam */}
            <div className="w-3.5 h-2 bg-amber-700 border-x-2 border-[#18181B]" />
          </div>
        </div>
      </div>
    </div>
  );
}
