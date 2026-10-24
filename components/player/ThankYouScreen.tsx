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
      className="w-full max-w-lg mx-auto text-center px-4 py-8 sm:py-14 select-none"
    >
      <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] mb-3">
        CẢM ƠN BẠN ĐÃ THAM GIA!
      </h1>

      <p className="text-xs sm:text-sm text-zinc-600 mb-6 font-medium leading-relaxed">
        Lựa chọn của <span className="font-bold text-black">{teamName ? `${teamName} (${playerName})` : playerName}</span> đã được ghi nhận vào cán cân thời gian thực của lớp.
      </p>

      <div className="flex items-center justify-center gap-6 sm:gap-10 text-center my-6 bg-white p-4 sm:p-5 border-2 border-zinc-200 shadow-[0_2px_0_0_#18181B]">
        <div>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-blue-600">
            <PixelBrain className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Lý trí</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#18181B]">
            {rational} Giá
          </div>
        </div>

        <div className="text-zinc-300 text-3xl font-light">/</div>

        <div>
          <div className="flex items-center justify-center gap-1.5 mb-1 text-red-600">
            <PixelHeart className="w-5 h-5" />
            <span className="text-xs font-black uppercase">Tình cảm</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#18181B]">
            {emotional} Giá
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        {onResetPlayer && (
          <button
            type="button"
            onClick={onResetPlayer}
            className="pixel-btn w-full sm:w-auto px-6 py-3.5 bg-[#18181B] text-white hover:bg-zinc-800 text-xs sm:text-sm font-black cursor-pointer shadow-[0_2px_0_0_#000]"
          >
            THOÁT RA & VÀO PHÒNG MỚI
          </button>
        )}

        <Link
          href="/"
          className="pixel-btn w-full sm:w-auto px-5 py-3.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300 text-xs sm:text-sm font-bold text-center"
        >
          ← Về trang chủ
        </Link>
      </div>
    </motion.div>
  );
}
