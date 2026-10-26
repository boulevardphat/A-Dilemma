'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PixelBrain, PixelHeart } from './PixelIcons';
import { Player } from '@/lib/types';
import { sound } from '@/lib/sound';

interface PixelMangaClashSummaryProps {
  totalRational: number;
  totalEmotional: number;
  players?: Player[];
  isHost?: boolean;
  onReset?: () => void;
  onDeleteRoom?: () => void;
  onHome?: () => void;
}

export function PixelMangaClashSummary({
  totalRational,
  totalEmotional,
  players = [],
  isHost = false,
  onReset,
  onDeleteRoom,
  onHome,
}: PixelMangaClashSummaryProps) {
  const totalVotes = totalRational + totalEmotional;
  const percentRational = totalVotes > 0 ? Math.round((totalRational / totalVotes) * 100) : 50;
  const percentEmotional = totalVotes > 0 ? 100 - percentRational : 50;

  const rationalCoins = Math.round(totalRational / 10);
  const emotionalCoins = Math.round(totalEmotional / 10);

  const rationalWon = percentRational > percentEmotional;
  const emotionalWon = percentEmotional > percentRational;
  const isDraw = percentRational === percentEmotional;

  const rationalPlayers = players.filter((p) => p.rational >= 50);
  const emotionalPlayers = players.filter((p) => p.emotional > 50);

  useEffect(() => {
    sound.playRoundStart();
  }, []);

  return (
    <div className="relative w-full min-h-[600px] sm:min-h-[680px] bg-[#0A0D18] text-white overflow-hidden border-4 border-[#18181B] shadow-[0_6px_0_0_#18181B] select-none my-4">
      {/* MANGA BATTLE SPEEDLINES BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at center, transparent 0, transparent 4px, rgba(255, 255, 255, 0.4) 5px, transparent 6px)',
          backgroundSize: '100% 100%',
        }}
      />

      {/* DIAGONAL MANGA BATTLEFIELD */}
      <div className="relative z-20 w-full h-[520px] sm:h-[580px] flex flex-col md:flex-row overflow-hidden">
        {/* ========================================================
            LEFT / UPPER CLASH HALF: LÝ TRÍ (RATIONAL)
            ======================================================== */}
        <motion.div
          initial={{ x: -120, y: -60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
          className="relative flex-1 bg-gradient-to-br from-[#0E2A6A] via-[#103E99] to-[#0A1A40] p-6 sm:p-10 flex flex-col justify-between overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)',
          }}
        >
          {/* Action speed lines SVG */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6 12" />
              <line x1="10%" y1="0" x2="90%" y2="100%" stroke="white" strokeWidth="1.5" strokeDasharray="8 14" />
              <line x1="0" y1="20%" x2="100%" y2="80%" stroke="white" strokeWidth="2" strokeDasharray="5 15" />
            </svg>
          </div>

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PixelBrain className="w-8 h-8 sm:w-10 sm:h-10 text-blue-300 drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)]" />
              <div>
                <span className="text-2xl sm:text-4xl font-black italic tracking-wider block text-white drop-shadow-[0_2px_4px_#000]">
                  LÝ TRÍ
                </span>
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-blue-200 uppercase block font-bold">
                  TRỊ DỨT ĐIỂM 1 NGƯỜI
                </span>
              </div>
            </div>
          </div>

          {/* Giant Impact Number */}
          <div className="relative z-10 my-auto py-4">
            <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-[0_6px_0_#061838] tracking-tight">
              {percentRational}%
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1.5 bg-blue-900/80 border border-blue-400 text-sm sm:text-base font-mono font-bold text-blue-100">
                🪙 {rationalCoins} XU · {totalRational} GIÁ
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            CENTER CLASH BURST: GIANT UNFRAMED MANGA "VS"
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20, delay: 0.2 }}
            className="font-mono text-8xl sm:text-9xl md:text-[140px] font-black italic tracking-tighter text-amber-400 select-none"
            style={{
              textShadow:
                '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 8px 30px rgba(0,0,0,0.95)',
            }}
          >
            VS
          </motion.span>
        </div>

        {/* ========================================================
            RIGHT / LOWER CLASH HALF: TÌNH CẢM (EMOTIONAL)
            ======================================================== */}
        <motion.div
          initial={{ x: 120, y: 60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
          className="relative flex-1 bg-gradient-to-br from-[#800C16] via-[#B91C1C] to-[#450A0A] p-6 sm:p-10 flex flex-col justify-between overflow-hidden"
          style={{
            clipPath: 'polygon(0 12%, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* Action speed lines SVG */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="white" strokeWidth="2" strokeDasharray="6 12" />
              <line x1="90%" y1="0" x2="10%" y2="100%" stroke="white" strokeWidth="1.5" strokeDasharray="8 14" />
              <line x1="100%" y1="20%" x2="0" y2="80%" stroke="white" strokeWidth="2" strokeDasharray="5 15" />
            </svg>
          </div>

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-end text-right self-end w-full">
            <div className="flex items-center gap-2 ml-auto">
              <div>
                <span className="text-2xl sm:text-4xl font-black italic tracking-wider block text-white drop-shadow-[0_2px_4px_#000]">
                  TÌNH CẢM
                </span>
                <span className="text-[11px] sm:text-xs font-mono tracking-widest text-red-200 uppercase block font-bold">
                  TRỊ CẦM CHỪNG CẢ 2
                </span>
              </div>
              <PixelHeart className="w-8 h-8 sm:w-10 sm:h-10 text-red-300 drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]" />
            </div>
          </div>

          {/* Giant Impact Number */}
          <div className="relative z-10 my-auto py-4 text-right">
            <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-[0_6px_0_#38080C] tracking-tight">
              {percentEmotional}%
            </div>
            <div className="flex items-center gap-2 justify-end mt-2">
              <span className="px-3 py-1.5 bg-red-950/80 border border-red-400 text-sm sm:text-base font-mono font-bold text-red-100">
                🪙 {emotionalCoins} XU · {totalEmotional} GIÁ
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FOOTER ACTIONS BAR */}
      <div className="relative z-30 p-3 sm:p-4 bg-black/85 border-t-2 border-amber-400 flex flex-wrap items-center justify-center gap-3">
        {isHost ? (
          <>
            {onReset && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onReset();
                }}
                className="pixel-btn px-6 sm:px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-black cursor-pointer shadow-[0_3px_0_0_#000]"
              >
                CHƠI LẠI PHÒNG NÀY
              </button>
            )}
            {onDeleteRoom && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onDeleteRoom();
                }}
                className="pixel-btn px-6 sm:px-8 py-3 bg-[#E50914] text-white hover:bg-red-700 text-xs sm:text-sm font-black cursor-pointer shadow-[0_3px_0_0_#000]"
              >
                ĐÓNG & XÓA PHÒNG
              </button>
            )}
          </>
        ) : (
          onHome && (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="pixel-btn px-6 sm:px-8 py-3 bg-white text-black hover:bg-zinc-200 text-xs sm:text-sm font-black cursor-pointer shadow-[0_3px_0_0_#000]"
            >
              ← VỀ TRANG CHỦ
            </button>
          )
        )}
      </div>
    </div>
  );
}
