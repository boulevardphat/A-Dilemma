'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ClientRoomState, PlayerMode } from '@/lib/types';
import { JoinForm } from '@/components/player/JoinForm';
import { RatioSlider } from '@/components/player/RatioSlider';
import { ThankYouScreen } from '@/components/player/ThankYouScreen';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';

const DEFAULT_ROOM = 'CLASS';

export default function PlayerPage() {
  const [player, setPlayer] = useState<{
    id: string;
    name: string;
    type: PlayerMode;
    teamName?: string;
  } | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('dilemma_player_v2');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [roomState, setRoomState] = useState<ClientRoomState | null>(null);
  const [localRational, setLocalRational] = useState<number>(50);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Polling room state every 1s
  useEffect(() => {
    if (!player) return;
    let isMounted = true;
    const fetchRoom = async () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      try {
        const res = await fetch(`/api/rooms/${DEFAULT_ROOM}?playerId=${player.id}`);
        if (res.ok && isMounted) {
          const data: ClientRoomState = await res.json();
          setRoomState(data);
          if (data.myVote && debounceTimerRef.current === null) {
            setLocalRational(data.myVote.rational);
          }
        }
      } catch {
        // offline fallback
      }
    };

    fetchRoom();
    const interval = setInterval(fetchRoom, 1500);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [player]);

  const handleJoin = async (formData: {
    name: string;
    type: PlayerMode;
    teamName?: string;
  }) => {
    setJoining(true);
    setJoinError(null);
    try {
      const id = 'p_' + Math.random().toString(36).substring(2, 9);
      const res = await fetch(`/api/rooms/${DEFAULT_ROOM}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          id,
          name: formData.name,
          type: formData.type,
          teamName: formData.teamName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setJoinError(data.error || 'Không thể tham gia phòng. Vui lòng thử lại.');
        setJoining(false);
        return;
      }

      const playerData = {
        id,
        name: formData.name,
        type: formData.type,
        teamName: formData.teamName,
      };

      setPlayer(playerData);
      setRoomState(data.room);
      if (data.player) {
        setLocalRational(data.player.rational);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dilemma_player_v2', JSON.stringify(playerData));
      }
    } catch {
      setJoinError('Lỗi kết nối máy chủ. Vui lòng thử lại.');
    } finally {
      setJoining(false);
    }
  };

  const handleSliderChange = (newRational: number) => {
    setLocalRational(newRational);

    if (!player) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      debounceTimerRef.current = null;
      try {
        await fetch(`/api/rooms/${DEFAULT_ROOM}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'vote',
            playerId: player.id,
            rational: newRational,
          }),
        });
      } catch {
        // silent fail
      }
    }, 200);
  };

  const handleResetPlayer = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dilemma_player_v2');
    }
    setPlayer(null);
    setRoomState(null);
  };

  // 1. If not joined, show clean Join Form
  if (!player) {
    return (
      <main className="min-h-screen relative flex flex-col justify-center items-center px-4">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-xs text-zinc-500 hover:text-black font-medium">
            ← trang chủ
          </Link>
        </div>
        <JoinForm onJoin={handleJoin} loading={joining} error={joinError} />
      </main>
    );
  }

  // 2. If game finished / thank you
  if (roomState?.status === 'THANK_YOU') {
    return (
      <main className="min-h-screen relative flex flex-col justify-center items-center px-4">
        <div className="absolute top-4 left-4">
          <Link href="/" className="text-xs text-zinc-500 hover:text-black font-medium">
            ← trang chủ
          </Link>
        </div>
        <ThankYouScreen
          playerName={player.name}
          teamName={player.teamName}
          rational={localRational}
          emotional={100 - localRational}
          onResetPlayer={handleResetPlayer}
        />
      </main>
    );
  }

  // Tilt angle for local scale
  const localTilt = Math.round(((100 - localRational - localRational) / 100) * 25 * 10) / 10;
  const mins = Math.floor((roomState?.timerRemaining || 0) / 60);
  const secs = (roomState?.timerRemaining || 0) % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Top Left: Back button */}
      <div className="absolute top-4 left-4 flex items-center gap-3">
        <Link href="/" className="text-xs text-zinc-500 hover:text-black font-medium">
          ← trang chủ
        </Link>
        <button
          type="button"
          onClick={handleResetPlayer}
          className="text-xs text-zinc-400 hover:text-zinc-600 font-medium"
        >
          (đổi người)
        </button>
      </div>

      {/* Top Right: Corner info (unboxed, lowercase, small) */}
      <div className="absolute top-4 right-4 text-xs text-zinc-500 font-medium tracking-tight select-none">
        {player.teamName ? `${player.teamName} (${player.name})` : player.name}
        {roomState && roomState.status !== 'LOBBY' && (
          <span className="ml-2 font-mono font-bold text-[#18181B]">
            {timerStr}
          </span>
        )}
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Full screen Breaking News if active on player */}
        {roomState?.twist && !roomState.timerRunning && (
          <PixelBreakingNews
            twist={roomState.twist}
            timerRunning={roomState.timerRunning}
          />
        )}

        {/* LOBBY VIEW - Unboxed, breathable with animated entrance */}
        {roomState?.status === 'LOBBY' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-10 px-2"
          >
            <h2 className="text-lg font-bold text-[#18181B] mb-1">
              đã sẵn sàng: {player.teamName ? `${player.teamName} (${player.name})` : player.name}
            </h2>
            <p className="text-xs text-zinc-500 mb-6 font-medium">
              chờ quản trò bấm bắt đầu...
            </p>

            <div className="text-left text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto my-6">
              <div className="font-semibold text-zinc-800 mb-1">tình huống giả định:</div>
              có 2 bệnh nhân nhiễm bệnh đang chuyển biến tiêu cực. bạn nắm trong tay 100 giá đại lộ để lựa chọn giữa:
              <br />
              - <span className="font-bold text-blue-700">lý trí</span>: trị dứt điểm 1 người (ưu tiên thực tế).
              <br />
              - <span className="font-bold text-red-600">tình cảm</span>: trị cầm chừng cả 2 người (nhiều rủi ro hơn).
            </div>
          </motion.div>
        )}

        {/* ACTIVE PLAY VIEW - Unboxed, central focus on scale and slider */}
        {roomState && roomState.status !== 'LOBBY' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* The Physical Scale */}
            <div className="py-2">
              <PixelScale
                rationalAmount={localRational}
                emotionalAmount={100 - localRational}
                tiltAngle={localTilt}
                size="md"
                showCoins
              />
            </div>

            {/* The Smooth Ratio Slider */}
            <RatioSlider
              rational={localRational}
              onChange={handleSliderChange}
              disabled={!roomState.timerRunning && roomState.timerRemaining === 0}
            />

            {/* Subtle note at bottom */}
            <div className="text-center text-[11px] text-zinc-400">
              kéo thanh trượt để chia 10 đồng xu đại lộ
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
