'use client';

import React from 'react';
import { PixelCoin } from './PixelIcons';

export interface PixelScaleProps {
  rationalAmount: number;
  emotionalAmount: number;
  tiltAngle: number;
  size?: 'sm' | 'md' | 'lg';
  showCoins?: boolean;
  /**
   * Density or multiplier of coins to display:
   * - 'standard' or 1: max ~10-12 coins per side
   * - 'rich' or 2: max ~20-24 coins per side (default, allows >10 coins)
   * - 'party' or 3: max ~30-36 coins per side (massive avalanche effect)
   */
  coinDensity?: 'standard' | 'rich' | 'party' | number;
  maxCoinsPerSide?: number;
}

export function PixelScale({
  rationalAmount,
  emotionalAmount,
  tiltAngle,
  size = 'md',
  showCoins = true,
  coinDensity,
  maxCoinsPerSide,
}: PixelScaleProps) {
  // Tame tilt angle to max +/- 16 deg so the beam tilts smoothly without extreme distortion
  const safeTilt = Math.max(-16, Math.min(16, tiltAngle * 0.64));

  // Determine multiplier: default to 'rich' (2x, allows more than 10 coins)
  const multiplier =
    typeof coinDensity === 'number'
      ? coinDensity
      : coinDensity === 'party'
      ? 3
      : coinDensity === 'standard'
      ? 1
      : size === 'lg'
      ? 2.5
      : 2;

  const totalPoints = rationalAmount + emotionalAmount;
  const maxCoins = maxCoinsPerSide ?? (size === 'lg' ? 36 : 24);

  let rationalCoins: number;
  let emotionalCoins: number;

  if (totalPoints <= 0) {
    rationalCoins = 0;
    emotionalCoins = 0;
  } else if (totalPoints <= 100) {
    // Single-player mode (100 Giá base):
    // Multiplier = 2 -> 1 coin = 5 Giá (up to 20 coins total: e.g. 16 vs 4)
    // Multiplier = 3 -> 1 coin = 3.33 Giá (up to 30 coins total: e.g. 24 vs 6)
    // Multiplier = 1 -> 1 coin = 10 Giá (up to 10 coins total)
    const ptsPerCoin = 10 / multiplier;
    rationalCoins = Math.min(maxCoins, Math.round(rationalAmount / ptsPerCoin));
    emotionalCoins = Math.min(maxCoins, Math.round(emotionalAmount / ptsPerCoin));
  } else {
    // Multiplayer aggregated votes (Host view, e.g. hundreds or thousands of Giá):
    // Scales dynamically with the total vote count so coins pile up rich and high!
    const targetCoins = Math.min(
      maxCoins * 2,
      Math.max(20, Math.round((totalPoints / 25) * (multiplier / 2)))
    );
    const ratRatio = rationalAmount / totalPoints;
    const emoRatio = emotionalAmount / totalPoints;
    rationalCoins = Math.min(maxCoins, Math.round(targetCoins * ratRatio));
    emotionalCoins = Math.min(maxCoins, Math.round(targetCoins * emoRatio));
  }

  // Stamp on coins: if 1 coin = 5 Giá, show '5'. If 1 coin = 10 Giá, show '10'.
  const coinStamp = multiplier === 1 ? 10 : multiplier === 2 ? 5 : undefined;

  const scaleWidth =
    size === 'lg' ? 'w-full max-w-3xl' : size === 'sm' ? 'w-full max-w-sm' : 'w-full max-w-xl';
  const beamHeight = size === 'lg' ? 'h-6' : size === 'sm' ? 'h-4' : 'h-5';
  const panWidth = size === 'lg' ? 'w-44 md:w-52' : size === 'sm' ? 'w-28' : 'w-36 sm:w-40';
  const containerHeight =
    size === 'lg' ? 'h-64 sm:h-72 md:h-80' : size === 'sm' ? 'h-44' : 'h-52 sm:h-60';
  const pillarHeight =
    size === 'lg' ? 'h-32 sm:h-36 md:h-40' : size === 'sm' ? 'h-20 sm:h-24' : 'h-24 sm:h-28';
  const coinSize =
    size === 'lg' ? 'w-6 h-6 sm:w-7 sm:h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-1 pb-2`}>
      {/* Physical Scale Assembly */}
      <div className={`relative w-full ${containerHeight} flex items-center justify-center overflow-visible`}>
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-5 h-5 bg-amber-500 border-2 border-[#18181B] rotate-45 mb-[-10px] z-20" />

          {/* Vertical Shaft */}
          <div
            className={`w-4 ${pillarHeight} bg-gradient-to-b from-amber-400 via-amber-600 to-amber-700 border-x-2 border-[#18181B] flex flex-col justify-around items-center`}
          >
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

        {/* Rotating Crossbeam Assembly - Tilts by safeTilt degrees */}
        <div
          className="relative w-full max-w-[92%] transition-transform duration-300 ease-out z-20"
          style={{ transform: `rotate(${safeTilt}deg)` }}
        >
          {/* LEFT SIDE: Rational Platform & Coins resting directly ON the tray */}
          {/* NOTE: No counter-rotation on coins container so coins tilt naturally with the scale! */}
          <div className="absolute left-1 sm:left-3 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack resting squarely on the tilted tray */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-10 flex flex-wrap-reverse justify-center items-end gap-1 pb-0.5">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={coinStamp}
                      className={`${coinSize} drop-shadow-sm transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam with retaining lips */}
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

          {/* RIGHT SIDE: Emotional Platform & Coins resting directly ON the tray */}
          {/* NOTE: No counter-rotation on coins container so coins tilt naturally with the scale! */}
          <div className="absolute right-1 sm:right-3 bottom-full mb-0 flex flex-col items-center origin-bottom">
            {/* Coins Stack resting squarely on the tilted tray */}
            <div className={`${panWidth} flex flex-col items-center justify-end origin-bottom`}>
              {showCoins && (
                <div className="min-h-10 flex flex-wrap-reverse justify-center items-end gap-1 pb-0.5">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <PixelCoin
                      key={i}
                      value={coinStamp}
                      className={`${coinSize} drop-shadow-sm transition-transform duration-150 hover:scale-110`}
                    />
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-[10px] text-zinc-400 py-1 font-mono">0 xu</span>
                  )}
                </div>
              )}
            </div>

            {/* Brass Tray / Pan seated solidly on the beam with retaining lips */}
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
