'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PixelBrain, PixelHeart } from '../pixel/PixelIcons';

interface ThankYouScreenProps {
  playerName: string;
  rational: number;
  emotional: number;
  teamName?: string;
  onResetPlayer?: () => void;
}

export function ThankYouScreen({
  playerName,
  rational,
  emotional,
  teamName,
  onResetPlayer,
}: ThankYouScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="w-full max-w-lg mx-auto text-center px-4 py-16"
    >
      {/* Big Central Thank You Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#18181B] tracking-tight mb-4">
        CẢM ƠN BẠN ĐÃ THAM GIA!
      </h1>

      <p className="text-sm text-zinc-600 mb-8 font-medium">
        Đồng tiền Đại lộ của {teamName ? `${teamName} (${playerName})` : playerName} đã được ghi nhận vào cán cân lớp học.
      </p>

      {/* Final Choice - Unboxed, clean numbers */}
      <div className="flex items-center justify-center gap-8 text-center my-6">
        <div>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-blue-600">
            <PixelBrain className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Lý trí</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
            {rational} Giá
          </div>
        </div>

        <div className="text-zinc-300 text-2xl font-light">|</div>

        <div>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-red-600">
            <PixelHeart className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Tình cảm</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B]">
            {emotional} Giá
          </div>
        </div>
      </div>

      {/* Action buttons (Back to home / Re-join) */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <Link
          href="/"
          className="pixel-btn px-4 py-2 bg-white text-[#18181B] hover:bg-zinc-100 text-xs font-bold"
        >
          ← Về trang chủ
        </Link>

        {onResetPlayer && (
          <button
            type="button"
            onClick={onResetPlayer}
            className="pixel-btn px-4 py-2 bg-[#18181B] text-white hover:bg-zinc-800 text-xs font-bold"
          >
            Đổi tên / Bỏ phiếu lại
          </button>
        )}
      </div>
    </motion.div>
  );
}
