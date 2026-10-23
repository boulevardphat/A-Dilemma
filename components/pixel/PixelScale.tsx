'use client';

import React from 'react';
import { motion } from 'motion/react';
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

  const scaleWidth = size === 'lg' ? 'w-full max-w-2xl' : size === 'sm' ? 'w-full max-w-sm' : 'w-full max-w-md';
  const beamHeight = size === 'lg' ? 'h-5' : size === 'sm' ? 'h-3' : 'h-4';
  const chainLength = size === 'lg' ? 'h-24' : size === 'sm' ? 'h-14' : 'h-18';
  const panWidth = size === 'lg' ? 'w-36' : size === 'sm' ? 'w-24' : 'w-28';

  return (
    <div className={`flex flex-col items-center select-none ${scaleWidth} mx-auto my-2`}>
      {/* Physical Scale Assembly */}
      <div className="relative w-full h-60 md:h-64 flex items-center justify-center">
        {/* Fixed Center Base & Fulcrum Pillar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          {/* Fulcrum Top Pivot Needle */}
          <div className="w-4 h-4 bg-amber-500 border border-[#18181B] rotate-45 mb-[-8px] z-20 shadow-sm" />

          {/* Vertical Shaft */}
          <div className="w-3.5 h-32 md:h-36 bg-amber-600 border-x-2 border-[#18181B] flex flex-col justify-around items-center">
            <div className="w-2 h-1 bg-amber-300" />
            <div className="w-2 h-1 bg-amber-800" />
          </div>

          {/* Stepped Pedestal Base */}
          <div className="w-14 h-3 bg-amber-700 border-2 border-[#18181B]" />
          <div className="w-24 h-4 bg-[#18181B] flex items-center justify-center">
            <span className="text-[7px] text-amber-300 font-mono tracking-widest font-bold">
              ĐẠI LỘ
            </span>
          </div>
        </div>

        {/* Rotating Crossbeam Assembly with Spring Animation */}
        <motion.div
          className="relative w-full max-w-[90%] z-20"
          animate={{ rotate: tiltAngle }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        >
          {/* Horizontal Brass Beam */}
          <div
            className={`w-full ${beamHeight} bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-2 border-[#18181B] flex items-center justify-between px-2`}
          >
            <div className="w-2.5 h-2.5 bg-[#18181B]" />
            <div className="w-5 h-5 bg-[#18181B] flex items-center justify-center">
              <motion.div
                className="w-1 h-3 bg-amber-300"
                animate={{ rotate: -tiltAngle * 1.5 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              />
            </div>
            <div className="w-2.5 h-2.5 bg-[#18181B]" />
          </div>

          {/* Left Pan (Rational) */}
          <div className="absolute left-1 top-full flex flex-col items-center">
            {/* Hanging Chains */}
            <div className={`${chainLength} flex justify-between w-10 px-1`}>
              <div className="w-0.5 h-full bg-[#18181B]" />
              <div className="w-0.5 h-full bg-[#18181B]" />
            </div>

            {/* Counter-rotating Left Pan */}
            <motion.div
              className={`${panWidth} flex flex-col items-center`}
              animate={{ rotate: -tiltAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              {showCoins && (
                <div className="min-h-8 flex flex-wrap-reverse justify-center items-end gap-0.5 pb-1">
                  {Array.from({ length: rationalCoins }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, y: -6 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.02 }}
                    >
                      <PixelCoin className="w-5 h-5" />
                    </motion.div>
                  ))}
                  {rationalCoins === 0 && (
                    <span className="text-[9px] text-zinc-400 py-1">0 xu</span>
                  )}
                </div>
              )}

              {/* Blue Dish Shape */}
              <div className="w-full bg-blue-600 border-2 border-[#18181B] border-t-0 p-1 text-center text-white shadow-sm">
                <div className="flex items-center justify-center gap-1">
                  <PixelBrain className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-tight">LÝ TRÍ</span>
                </div>
                <div className="text-[9px] font-medium text-blue-100">
                  {rationalAmount} Giá
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Pan (Emotional) */}
          <div className="absolute right-1 top-full flex flex-col items-center">
            {/* Hanging Chains */}
            <div className={`${chainLength} flex justify-between w-10 px-1`}>
              <div className="w-0.5 h-full bg-[#18181B]" />
              <div className="w-0.5 h-full bg-[#18181B]" />
            </div>

            {/* Counter-rotating Right Pan */}
            <motion.div
              className={`${panWidth} flex flex-col items-center`}
              animate={{ rotate: -tiltAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              {showCoins && (
                <div className="min-h-8 flex flex-wrap-reverse justify-center items-end gap-0.5 pb-1">
                  {Array.from({ length: emotionalCoins }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, y: -6 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.02 }}
                    >
                      <PixelCoin className="w-5 h-5" />
                    </motion.div>
                  ))}
                  {emotionalCoins === 0 && (
                    <span className="text-[9px] text-zinc-400 py-1">0 xu</span>
                  )}
                </div>
              )}

              {/* Red Dish Shape */}
              <div className="w-full bg-red-600 border-2 border-[#18181B] border-t-0 p-1 text-center text-white shadow-sm">
                <div className="flex items-center justify-center gap-1">
                  <PixelHeart className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-tight">TÌNH CẢM</span>
                </div>
                <div className="text-[9px] font-medium text-red-100">
                  {emotionalAmount} Giá
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
