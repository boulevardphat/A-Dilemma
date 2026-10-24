'use client';

import React from 'react';
import Link from 'next/link';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelPointerHand } from '@/components/pixel/PixelIcons';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 text-[#18181B] select-none bg-[#FBF9F5]">
      {/* Top bar */}
      <header className="w-full max-w-4xl flex items-center justify-between text-sm text-zinc-500 font-bold">
        <span>A DILEMMA</span>
        <span>NHÓM NONAME</span>
      </header>

      {/* Center content - Scaled up for strong presence */}
      <div className="w-full max-w-3xl text-center my-auto py-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-3 tracking-tight">
          A DILEMMA
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 mb-8 max-w-md mx-auto font-medium">
          Trò chơi phân bổ 100 Giá Đại lộ và khám phá hiện tượng thiên kiến truyền thông
        </p>

        {/* Scaled preview */}
        <div className="my-6 pointer-events-none opacity-95">
          <PixelScale
            rationalAmount={50}
            emotionalAmount={50}
            tiltAngle={0}
            size="md"
            showCoins
          />
        </div>

        {/* 2 Clear Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/play"
            className="pixel-btn w-full sm:w-auto px-8 py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-black text-base flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_3px_0_0_#000]"
          >
            <PixelPointerHand className="w-5 h-5 text-amber-400" />
            <span>VÀO PHÒNG CHƠI</span>
          </Link>

          <Link
            href="/host"
            className="pixel-btn w-full sm:w-auto px-8 py-4 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 font-black text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>MÀN HÌNH QUẢN TRÒ</span>
          </Link>
        </div>
      </div>

      <div />
    </main>
  );
}
