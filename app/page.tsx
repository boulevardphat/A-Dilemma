'use client';

import React from 'react';
import Link from 'next/link';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelPointerHand } from '@/components/pixel/PixelIcons';
import { PixelSoundToggle } from '@/components/pixel/PixelSoundToggle';
import { sound } from '@/lib/sound';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-8 md:p-10 text-[#18181B] select-none bg-[#FBF9F5] overflow-x-hidden">
      {/* Top bar */}
      <header className="w-full max-w-3xl flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-bold px-1">
        <span>A DILEMMA · NHÓM NONAME</span>
        <PixelSoundToggle />
      </header>

      {/* Center content - Airy and spacious on mobile */}
      <div className="w-full max-w-xl text-center my-auto py-4 sm:py-8 px-2">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-3 tracking-tight">
          A DILEMMA
        </h1>
        <p className="text-xs sm:text-base text-zinc-600 mb-4 sm:mb-6 max-w-md mx-auto font-medium leading-relaxed">
          Trò chơi phân bổ 100 Giá Đại lộ và khám phá hiện tượng thiên kiến truyền thông
        </p>

        {/* Scaled preview with plenty of breathing room */}
        <div className="my-2 sm:my-4 pointer-events-none opacity-95">
          <PixelScale
            rationalAmount={50}
            emotionalAmount={50}
            tiltAngle={0}
            size="sm"
            showCoins
          />
        </div>

        {/* 2 Clear Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/play"
            onClick={() => sound.playClick()}
            className="pixel-btn w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-[0_3px_0_0_#000]"
          >
            <PixelPointerHand className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span>VÀO PHÒNG CHƠI</span>
          </Link>

          <Link
            href="/host"
            onClick={() => sound.playClick()}
            className="pixel-btn w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>MÀN HÌNH QUẢN TRÒ</span>
          </Link>
        </div>
      </div>

      <div />
    </main>
  );
}
