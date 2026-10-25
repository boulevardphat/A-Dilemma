'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PixelBrain, PixelHeart } from '../pixel/PixelIcons';
import { PixelMangaClashSummary } from '../pixel/PixelMangaClashSummary';
import { Player } from '@/lib/types';

interface ThankYouScreenProps {
  playerName: string;
  rational: number;
  emotional: number;
  teamName?: string;
  totalRational?: number;
  totalEmotional?: number;
  players?: Player[];
  onResetPlayer?: () => void;
}

export function ThankYouScreen({
  playerName,
  rational,
  emotional,
  teamName,
  totalRational = 50,
  totalEmotional = 50,
  players = [],
  onResetPlayer,
}: ThankYouScreenProps) {
  return (
    <div className="w-full max-w-4xl mx-auto text-center px-2 py-4 select-none">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-4xl font-black text-[#18181B] mb-1">
          CẢM ƠN BẠN ĐÃ THAM GIA!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 font-medium">
          Lựa chọn của <strong className="text-black">{teamName ? `${teamName} (${playerName})` : playerName}</strong> ({rational} Giá Lý trí / {emotional} Giá Tình cảm) đã được tổng hợp vào kết quả lớp:
        </p>
      </div>

      {/* MANGA DIAGONAL BATTLE CLASH DISPLAY */}
      <PixelMangaClashSummary
        totalRational={totalRational}
        totalEmotional={totalEmotional}
        players={players}
        isHost={false}
        onHome={onResetPlayer}
      />

      {/* Personal Choice Quick Bar */}
      <div className="bg-white border-2 border-zinc-200 p-3 sm:p-4 my-4 flex items-center justify-around shadow-[0_2px_0_0_#18181B] max-w-md mx-auto">
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Bạn đã chọn Lý trí</div>
          <div className="text-lg sm:text-xl font-black text-blue-700">{rational} Giá ({Math.round(rational / 10)} xu)</div>
        </div>
        <div className="text-zinc-300 font-light text-2xl">/</div>
        <div className="text-center">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase">Bạn đã chọn Tình cảm</div>
          <div className="text-lg sm:text-xl font-black text-red-600">{emotional} Giá ({Math.round(emotional / 10)} xu)</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
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
    </div>
  );
}
