'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { PixelBrain, PixelHeart, PixelCoin } from './PixelIcons';
import { PixelMascotAvatar } from './PixelMascots';
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

      {/* TOP HEADER: MANGA ARCADE TITLE */}
      <div className="relative z-30 flex items-center justify-between p-3 sm:p-4 bg-black/60 border-b-2 border-amber-400">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-600 animate-ping inline-block" />
          <span className="font-mono font-black text-xs sm:text-sm tracking-widest text-amber-300 uppercase">
            TỔNG KẾT TRẬN CHIẾN TRUYỀN THÔNG · FINAL CLASH
          </span>
        </div>
        <div className="font-mono text-xs font-bold text-zinc-400">
          TỔNG {totalVotes} GIÁ ({players.length} NGƯỜI CHƠI)
        </div>
      </div>

      {/* DIAGONAL MANGA BATTLEFIELD */}
      <div className="relative z-20 w-full h-[520px] sm:h-[560px] flex flex-col md:flex-row overflow-hidden">
        {/* ========================================================
            LEFT / UPPER CLASH HALF: LÝ TRÍ (RATIONAL)
            ======================================================== */}
        <motion.div
          initial={{ x: -120, y: -60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.1 }}
          className="relative flex-1 bg-gradient-to-br from-[#0E2A6A] via-[#103E99] to-[#0A1A40] p-4 sm:p-8 flex flex-col justify-between overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black"
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
              <PixelBrain className="w-7 h-7 sm:w-9 sm:h-9 text-blue-300 drop-shadow-[0_2px_8px_rgba(59,130,246,0.8)]" />
              <div>
                <span className="text-xl sm:text-3xl font-black italic tracking-wider block text-white drop-shadow-[0_2px_4px_#000]">
                  LÝ TRÍ
                </span>
                <span className="text-[10px] font-mono tracking-widest text-blue-200 uppercase block font-bold">
                  TRỊ DỨT ĐIỂM 1 NGƯỜI
                </span>
              </div>
            </div>

            {rationalWon && (
              <div className="px-3 py-1 bg-amber-400 text-black font-black text-xs sm:text-sm font-mono tracking-wider border-2 border-white shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse transform rotate-3">
                ★ CHIẾN THẮNG ★
              </div>
            )}
          </div>

          {/* Giant Impact Number */}
          <div className="relative z-10 my-auto py-2">
            <div className="font-mono text-6xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-[0_6px_0_#061838] tracking-tight">
              {percentRational}%
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 bg-blue-900/80 border border-blue-400 text-xs sm:text-sm font-mono font-bold text-blue-100">
                🪙 {rationalCoins} XU · {totalRational} GIÁ
              </span>
            </div>
          </div>

          {/* Supporters Avatars */}
          <div className="relative z-10 pt-2 border-t border-blue-400/30">
            <div className="text-[10px] sm:text-xs font-mono font-bold text-blue-200 uppercase mb-1.5">
              Đồng thuận Lý trí ({rationalPlayers.length} người):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {rationalPlayers.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-0.5 bg-blue-950/80 border border-blue-400/60 text-[10px] font-bold flex items-center gap-1"
                  title={p.name}
                >
                  <PixelMascotAvatar mascotId={p.avatar || 'owl'} className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[80px] sm:max-w-[100px]">{p.teamName || p.name}</span>
                </div>
              ))}
              {rationalPlayers.length > 10 && (
                <span className="text-[10px] font-mono text-blue-300 self-center">
                  +{rationalPlayers.length - 10}...
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* ========================================================
            CENTER CLASH BURST: MANGA "VS" IMPACT STAR
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.3 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 border-4 border-black flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,1)] transform rotate-6"
          >
            <div className="text-center leading-none">
              <span className="font-mono text-xl sm:text-2xl font-black text-black tracking-tighter block italic">
                VS
              </span>
              <span className="text-[8px] font-mono font-black text-red-950 tracking-widest block uppercase">
                CLASH
              </span>
            </div>
          </motion.div>
        </div>

        {/* ========================================================
            RIGHT / LOWER CLASH HALF: TÌNH CẢM (EMOTIONAL)
            ======================================================== */}
        <motion.div
          initial={{ x: 120, y: 60, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
          className="relative flex-1 bg-gradient-to-br from-[#800C16] via-[#B91C1C] to-[#450A0A] p-4 sm:p-8 flex flex-col justify-between overflow-hidden"
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
          <div className="relative z-10 flex items-center justify-between text-right self-end w-full">
            {emotionalWon && (
              <div className="px-3 py-1 bg-amber-400 text-black font-black text-xs sm:text-sm font-mono tracking-wider border-2 border-white shadow-[0_0_15px_rgba(251,191,36,0.9)] animate-pulse transform -rotate-3">
                ★ CHIẾN THẮNG ★
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <div>
                <span className="text-xl sm:text-3xl font-black italic tracking-wider block text-white drop-shadow-[0_2px_4px_#000]">
                  TÌNH CẢM
                </span>
                <span className="text-[10px] font-mono tracking-widest text-red-200 uppercase block font-bold">
                  TRỊ CẦM CHỪNG CẢ 2
                </span>
              </div>
              <PixelHeart className="w-7 h-7 sm:w-9 sm:h-9 text-red-300 drop-shadow-[0_2px_8px_rgba(239,68,68,0.8)]" />
            </div>
          </div>

          {/* Giant Impact Number */}
          <div className="relative z-10 my-auto py-2 text-right">
            <div className="font-mono text-6xl sm:text-8xl md:text-9xl font-black text-white drop-shadow-[0_6px_0_#38080C] tracking-tight">
              {percentEmotional}%
            </div>
            <div className="flex items-center gap-2 justify-end mt-1">
              <span className="px-2.5 py-1 bg-red-950/80 border border-red-400 text-xs sm:text-sm font-mono font-bold text-red-100">
                🪙 {emotionalCoins} XU · {totalEmotional} GIÁ
              </span>
            </div>
          </div>

          {/* Supporters Avatars */}
          <div className="relative z-10 pt-2 border-t border-red-400/30">
            <div className="text-[10px] sm:text-xs font-mono font-bold text-red-200 uppercase mb-1.5 text-right">
              Đồng thuận Tình cảm ({emotionalPlayers.length} người):
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end max-h-20 overflow-y-auto">
              {emotionalPlayers.slice(0, 10).map((p) => (
                <div
                  key={p.id}
                  className="px-2 py-0.5 bg-red-950/80 border border-red-400/60 text-[10px] font-bold flex items-center gap-1"
                  title={p.name}
                >
                  <PixelMascotAvatar mascotId={p.avatar || 'cat'} className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[80px] sm:max-w-[100px]">{p.teamName || p.name}</span>
                </div>
              ))}
              {emotionalPlayers.length > 10 && (
                <span className="text-[10px] font-mono text-red-300 self-center">
                  +{emotionalPlayers.length - 10}...
                </span>
              )}
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
