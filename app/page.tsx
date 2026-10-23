'use client';

import React from 'react';
import Link from 'next/link';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelPointerHand } from '@/components/pixel/PixelIcons';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between items-center p-6 text-[#18181B] select-none bg-[#FBF9F5]">
      {/* Top minimal bar */}
      <header className="w-full max-w-2xl flex items-center justify-between text-xs text-zinc-500 font-medium">
        <span>a dilemma</span>
        <span>môn lịch sử báo chí</span>
      </header>

      {/* Center content */}
      <div className="w-full max-w-lg text-center my-auto py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          A DILEMMA
        </h1>
        <p className="text-sm text-zinc-500 mb-8 max-w-sm mx-auto">
          trò chơi phân bổ 100 giá đại lộ và khám phá hiện tượng thiên kiến truyền thông
        </p>

        {/* Scaled preview */}
        <div className="my-6 pointer-events-none opacity-90 scale-90 sm:scale-100">
          <PixelScale
            rationalAmount={50}
            emotionalAmount={50}
            tiltAngle={0}
            size="sm"
            showCoins
          />
        </div>

        {/* 2 Clear Action Buttons - Borderless */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/play"
            className="pixel-btn w-full sm:w-auto px-6 py-3.5 bg-[#18181B] text-white hover:bg-zinc-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <PixelPointerHand className="w-4 h-4 text-amber-400" />
            <span>VÀO PHÒNG CHƠI</span>
          </Link>

          <Link
            href="/host"
            className="pixel-btn w-full sm:w-auto px-6 py-3.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>MÀN HÌNH QUẢN TRÒ</span>
          </Link>
        </div>
      </div>

      {/* Bottom note */}
      <footer className="text-center text-xs text-zinc-400">
        thiết kế phục vụ giảng dạy báo chí
      </footer>
    </main>
  );
}
