'use client';

import React, { useState, useEffect, useRef } from 'react';
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
        const saved = sessionStorage.getItem('dilemma_player_v5');
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

  // Polling room state every 1000ms and maintaining connection heartbeat
  useEffect(() => {
    if (!player) return;
    let isMounted = true;

    const fetchRoom = async () => {
      try {
        const queryParams = new URLSearchParams({
          playerId: player.id,
          name: player.name,
          type: player.type,
          ...(player.teamName ? { teamName: player.teamName } : {}),
          t: Date.now().toString(),
        });

        const res = await fetch(`/api/rooms/${DEFAULT_ROOM}?${queryParams.toString()}`, {
          cache: 'no-store',
        });
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
    const interval = setInterval(fetchRoom, 1000);
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
        sessionStorage.setItem('dilemma_player_v5', JSON.stringify(playerData));
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
    }, 150);
  };

  const handleResetPlayer = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dilemma_player_v5');
    }
    setPlayer(null);
    setRoomState(null);
  };

  // 1. If not joined, show clean Join Form
  if (!player) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#FBF9F5]">
        <JoinForm onJoin={handleJoin} loading={joining} error={joinError} />
      </main>
    );
  }

  // 2. If game finished / thank you
  if (roomState?.status === 'THANK_YOU') {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center px-4 bg-[#FBF9F5]">
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
  const localTilt = Math.round(((100 - localRational - localRational) / 100) * 16 * 10) / 10;
  const mins = Math.floor((roomState?.timerRemaining || 0) / 60);
  const secs = (roomState?.timerRemaining || 0) % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isTwistWaiting =
    (roomState?.status === 'TWIST_1' || roomState?.status === 'TWIST_2') &&
    !roomState?.timerRunning &&
    roomState?.twist !== null;

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-between p-4 sm:p-6 bg-[#FBF9F5]">
      {/* Top Bar Info: Unboxed, small text */}
      <div className="w-full flex items-center justify-between text-xs text-zinc-500 font-medium select-none pt-1">
        <div>
          {player.teamName ? `${player.teamName} (${player.name})` : player.name}
        </div>
        <div>
          phòng lớp học
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto my-auto py-2">
        {/* Full screen Breaking News when twist occurs, dismissed when host starts timer */}
        {isTwistWaiting && roomState?.twist && (
          <PixelBreakingNews
            twist={roomState.twist}
            timerRunning={roomState.timerRunning}
          />
        )}

        {/* LOBBY VIEW - Clean, unboxed waiting room */}
        {roomState?.status === 'LOBBY' && (
          <div className="text-center py-10 px-2 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#18181B] mb-2">
              đã sẵn sàng: {player.teamName ? `${player.teamName} (${player.name})` : player.name}
            </h2>
            <p className="text-xs text-zinc-500 mb-8 font-medium">
              chờ quản trò bấm bắt đầu chơi trên màn hình chính...
            </p>

            <div className="text-left text-xs text-zinc-700 leading-relaxed max-w-sm mx-auto my-6 p-4 bg-white/80">
              <div className="font-bold text-zinc-900 mb-1">TÌNH HUỐNG GIẢ ĐỊNH:</div>
              Có 2 bệnh nhân nhiễm bệnh đang chuyển biến tiêu cực. Bạn nắm trong tay 100 Giá Đại lộ để lựa chọn giữa:
              <div className="mt-2 space-y-1">
                <div>
                  • <span className="font-bold text-blue-700">Lý trí</span>: Trị dứt điểm 1 người (thực tế, chắc chắn).
                </div>
                <div>
                  • <span className="font-bold text-red-600">Tình cảm</span>: Trị cầm chừng cả 2 người (tình cảm, rủi ro).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE PLAY VIEW: Large Centered Timer + Large Scale + Enlarged Slider */}
        {roomState && roomState.status !== 'LOBBY' && (
          <div className="flex flex-col items-center animate-fadeIn w-full">
            {/* BIG CENTERED TIMER - Placed directly above the scale */}
            <div className="text-center mb-1">
              <div
                className={`font-mono text-4xl sm:text-5xl font-black ${
                  roomState.timerRunning && roomState.timerRemaining <= 10
                    ? 'text-red-600 animate-pulse'
                    : 'text-[#18181B]'
                }`}
              >
                {timerStr}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                {roomState.timerRunning ? 'đồng hồ đang đếm ngược' : 'tạm dừng'}
              </div>
            </div>

            {/* The Physical Scale (Enlarged, safe clearance) */}
            <PixelScale
              rationalAmount={localRational}
              emotionalAmount={100 - localRational}
              tiltAngle={localTilt}
              size="md"
              showCoins
            />

            {/* The Smooth Ratio Slider (No overlap with scale) */}
            <RatioSlider
              rational={localRational}
              onChange={handleSliderChange}
              disabled={!roomState.timerRunning && roomState.timerRemaining === 0}
            />
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-zinc-400 pb-1">
        a dilemma · lịch sử báo chí
      </div>
    </main>
  );
}
