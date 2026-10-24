'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GameRoom, Player, PlayerMode } from '@/lib/types';
import { JoinForm } from '@/components/player/JoinForm';
import { RatioSlider } from '@/components/player/RatioSlider';
import { ThankYouScreen } from '@/components/player/ThankYouScreen';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import { PixelTeam, PixelUser } from '@/components/pixel/PixelIcons';
import {
  subscribeRoom,
  subscribePlayers,
  checkRoomExists,
  joinPlayer,
  submitVote,
  calculateTiltAngle,
} from '@/lib/game';

interface StoredPlayer {
  pin: string;
  id: string;
  name: string;
  type: PlayerMode;
  teamName?: string;
}

function PlayerContent() {
  const searchParams = useSearchParams();
  const urlPin = searchParams.get('pin')?.toUpperCase() || '';

  const [player, setPlayer] = useState<StoredPlayer | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved =
          sessionStorage.getItem('dilemma_player_v6') ||
          localStorage.getItem('dilemma_player_v6');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [room, setRoom] = useState<GameRoom | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [localRational, setLocalRational] = useState<number>(50);
  const [timerRemaining, setTimerRemaining] = useState<number>(60);
  const [joining, setJoining] = useState<boolean>(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // If URL has a different pin than stored player, handle appropriately
  const activePin = player?.pin || urlPin;

  // Real-time Firestore subscription to room and players
  useEffect(() => {
    if (!player?.pin) {
      setRoom(null);
      setPlayers([]);
      return;
    }

    const unsubRoom = subscribeRoom(player.pin, (updatedRoom) => {
      setRoom(updatedRoom);
    });

    const unsubPlayers = subscribePlayers(player.pin, (updatedPlayers) => {
      setPlayers(updatedPlayers);
      const me = updatedPlayers.find((p) => p.id === player.id);
      if (me && debounceTimerRef.current === null) {
        setLocalRational(me.rational);
      }
    });

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [player?.pin, player?.id]);

  // Synchronized countdown timer
  useEffect(() => {
    if (!room) return;

    if (!room.timerRunning || !room.timerEndsAt) {
      setTimerRemaining(room.timerRemaining || 0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = Math.max(0, (room.timerEndsAt || 0) - now);
      setTimerRemaining(Math.ceil(remainingMs / 1000));
    }, 250);

    return () => clearInterval(interval);
  }, [room]);

  const handleJoin = async (formData: {
    pin: string;
    name: string;
    type: PlayerMode;
    teamName?: string;
  }) => {
    setJoining(true);
    setJoinError(null);

    try {
      const pin = formData.pin.toUpperCase();
      const exists = await checkRoomExists(pin);

      if (!exists) {
        setJoinError(`Không tìm thấy phòng có mã PIN "${pin}". Vui lòng hỏi lại quản trò.`);
        setJoining(false);
        return;
      }

      const id = 'p_' + Math.random().toString(36).substring(2, 9);
      const joinedData = await joinPlayer(pin, {
        id,
        name: formData.name,
        type: formData.type,
        teamName: formData.teamName,
      });

      const playerData: StoredPlayer = {
        pin,
        id,
        name: joinedData.name,
        type: joinedData.type,
        teamName: joinedData.teamName,
      };

      setPlayer(playerData);
      setLocalRational(joinedData.rational);

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('dilemma_player_v6', JSON.stringify(playerData));
        localStorage.setItem('dilemma_player_v6', JSON.stringify(playerData));
      }
    } catch (err: unknown) {
      console.error('Lỗi khi vào phòng:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setJoinError(`Lỗi kết nối: ${msg}`);
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
        await submitVote(player.pin, player.id, newRational);
      } catch (err) {
        console.error('Lỗi cập nhật vote:', err);
      }
    }, 150);
  };

  const handleLeaveRoom = () => {
    if (confirm('Bạn có chắc muốn rời phòng này không?')) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('dilemma_player_v6');
        localStorage.removeItem('dilemma_player_v6');
      }
      setPlayer(null);
      setRoom(null);
      setPlayers([]);
    }
  };

  // 1. MÀN HÌNH NHẬP THÔNG TIN VÀO PHÒNG
  if (!player) {
    return (
      <main className="min-h-screen flex flex-col justify-between items-center p-6 bg-[#FBF9F5]">
        <div className="w-full max-w-md flex items-center justify-between text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-black">
            a dilemma
          </Link>
          <span>nhóm noname</span>
        </div>

        <JoinForm
          initialPin={activePin}
          onJoin={handleJoin}
          loading={joining}
          error={joinError}
        />

        <div />
      </main>
    );
  }

  // 2. MÀN HÌNH SẢNH CHỜ SINH VIÊN (KHI HOST CHƯA BẤM START)
  if (!room || room.status === 'LOBBY') {
    return (
      <main className="min-h-screen flex flex-col justify-between items-center p-6 sm:p-10 select-none bg-[#FBF9F5]">
        <div className="w-full max-w-2xl flex items-center justify-between text-sm text-zinc-500 font-medium">
          <div>
            PIN: <span className="font-bold text-zinc-900">{player.pin}</span>
          </div>
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="text-zinc-500 hover:text-red-600 font-bold cursor-pointer"
          >
            Rời phòng
          </button>
        </div>

        <div className="w-full max-w-xl mx-auto text-center my-auto py-8">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
            PHÒNG CHỜ LỚP HỌC
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#18181B] mb-3">
            CHÀO MỪNG {player.name.toUpperCase()}!
          </h2>

          {player.teamName && (
            <p className="text-sm text-emerald-700 font-bold mb-4">
              Đại diện cho: {player.teamName}
            </p>
          )}

          <p className="text-base text-zinc-700 mb-8 font-medium">
            Bạn đã sẵn sàng. Vui lòng nhìn lên màn hình chính của quản trò và chờ bắt đầu...
          </p>

          <div className="bg-white p-5 border-2 border-zinc-200 shadow-[0_2px_0_0_#18181B]">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">
              Thành viên trong phòng ({players.length} người)
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-h-56 overflow-y-auto">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="px-3 py-1.5 bg-zinc-100 text-xs font-bold flex items-center gap-1.5 border border-zinc-300"
                >
                  {p.type === 'team' ? (
                    <PixelTeam className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <PixelUser className="w-4 h-4 text-blue-600" />
                  )}
                  <span>{p.teamName ? `${p.teamName} (${p.name})` : p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div />
      </main>
    );
  }

  // Calculate aggregated stats
  let totalRational = 0;
  let totalEmotional = 0;
  players.forEach((p) => {
    totalRational += p.rational;
    totalEmotional += p.emotional;
  });
  const tiltAngle = calculateTiltAngle(totalRational, totalEmotional);

  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isTwistWaitingToStart =
    (room.status === 'TWIST_1' || room.status === 'TWIST_2') &&
    !room.timerRunning &&
    room.twist !== null;

  // 3. MÀN HÌNH KẾT THÚC CẢM ƠN
  if (room.status === 'THANK_YOU') {
    return (
      <main className="min-h-screen flex flex-col justify-between items-center p-6 bg-[#FBF9F5]">
        <div className="w-full max-w-xl flex items-center justify-between text-xs text-zinc-500 font-medium">
          <div>PIN: {player.pin}</div>
          <button
            type="button"
            onClick={handleLeaveRoom}
            className="text-zinc-500 hover:text-red-600 font-bold cursor-pointer"
          >
            Thoát phòng
          </button>
        </div>

        <ThankYouScreen
          playerName={player.name}
          teamName={player.teamName}
          rational={localRational}
          emotional={100 - localRational}
          onResetPlayer={handleLeaveRoom}
        />

        <div />
      </main>
    );
  }

  // 4. MÀN HÌNH ĐANG CHƠI (VÒNG 1, TWIST 1, TWIST 2)
  return (
    <main className="min-h-screen relative flex flex-col justify-between p-4 sm:p-8 select-none bg-[#FBF9F5]">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between text-sm text-zinc-600 font-bold">
        <div>
          PIN: <span className="font-black text-black">{player.pin}</span> · {player.name}
        </div>
        <div className="font-mono text-xl sm:text-2xl font-black text-[#18181B] bg-zinc-100 px-3 py-1 border border-zinc-300">
          {timerStr}
        </div>
      </div>

      {/* Breaking News Overlay for student */}
      {isTwistWaitingToStart && room.twist && (
        <PixelBreakingNews
          twist={room.twist}
          isHost={false}
          timerRunning={room.timerRunning}
        />
      )}

      {/* Main Interactive Stage - Scaled up to fill the viewport */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-4">
        <div className="w-full max-w-3xl text-center">
          <div className="text-sm sm:text-base uppercase tracking-wider text-zinc-600 font-black mb-2">
            {room.status === 'ROUND_1' && 'Vòng 1: Tình huống ban đầu (60s)'}
            {room.status === 'TWIST_1' && 'Vòng 2: Breaking News 1 (30s)'}
            {room.status === 'TWIST_2' && 'Vòng 3: Breaking News 2 (30s)'}
          </div>

          {/* Scale with player coins - 10 coins tilted with the scale */}
          <div className="my-3 pointer-events-none">
            <PixelScale
              rationalAmount={localRational}
              emotionalAmount={100 - localRational}
              tiltAngle={tiltAngle}
              size="md"
              showCoins
            />
          </div>

          {/* Interactive Ratio Slider - 10 coins, larger scale */}
          <RatioSlider
            rational={localRational}
            onChange={handleSliderChange}
            disabled={!room.timerRunning}
          />
        </div>
      </div>

      <div />
    </main>
  );
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] text-zinc-500 text-sm">
          Đang kết nối phòng chơi...
        </div>
      }
    >
      <PlayerContent />
    </Suspense>
  );
}
