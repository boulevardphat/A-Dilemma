'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameRoom, Player, PlayerMode } from '@/lib/types';
import { JoinForm } from '@/components/player/JoinForm';
import { RatioSlider } from '@/components/player/RatioSlider';
import { ThankYouScreen } from '@/components/player/ThankYouScreen';
import { PixelScale } from '@/components/pixel/PixelScale';
import { PixelBreakingNews } from '@/components/pixel/PixelBreakingNews';
import { PixelTeam, PixelUser } from '@/components/pixel/PixelIcons';
import { PixelNotificationCenter } from '@/components/pixel/PixelNotificationCenter';
import { useGameNotifications } from '@/lib/useGameNotifications';
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
  const router = useRouter();
  const urlPin = searchParams.get('pin')?.toUpperCase() || '';

  const [player, setPlayer] = useState<StoredPlayer | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Read only active session to prevent being trapped across browser sessions
        const saved = sessionStorage.getItem('dilemma_player_v6');
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

  const { notifications, addNotification, dismiss, syncPlayers } = useGameNotifications();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // If URL has a different pin than current stored session, switch to new pin
  useEffect(() => {
    if (urlPin && player?.pin && player.pin !== urlPin) {
      handleLeaveRoom(false);
    }
  }, [urlPin, player?.pin]);

  // Real-time Firestore subscription to room and players
  useEffect(() => {
    if (!player?.pin) {
      setRoom(null);
      setPlayers([]);
      return;
    }

    const unsubRoom = subscribeRoom(player.pin, (updatedRoom) => {
      if (!updatedRoom) {
        // Room was deleted, expired, or doesn't exist anymore!
        // Automatically release student so they are never trapped in an old room!
        handleLeaveRoom(false);
        setJoinError('Phòng này đã kết thúc hoặc được quản trò đóng lại.');
        return;
      }
      setRoom(updatedRoom);
    });

    const unsubPlayers = subscribePlayers(player.pin, (updatedPlayers) => {
      setPlayers(updatedPlayers);
      syncPlayers(updatedPlayers);
      const me = updatedPlayers.find((p) => p.id === player.id);
      if (me && debounceTimerRef.current === null) {
        setLocalRational(me.rational);
      }
    });

    return () => {
      unsubRoom();
      unsubPlayers();
    };
  }, [player?.pin, player?.id, syncPlayers]);

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
        setJoinError(`Không tìm thấy phòng "${pin}" (có thể phòng đã hết hạn hoặc chưa được tạo).`);
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
    const diff = newRational - localRational;
    const deltaCoins = Math.round(Math.abs(diff) / 10);
    if (deltaCoins > 0) {
      addNotification({
        actorName: player?.name || 'Bạn',
        isTeam: player?.type === 'team',
        deltaCoins,
        targetSide: diff > 0 ? 'rational' : 'emotional',
        fromSide: diff > 0 ? 'emotional' : 'rational',
        customTitle: 'BẠN VỪA ĐIỀU CHỈNH',
      });
    }

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

  const handleLeaveRoom = (confirmPrompt = false) => {
    if (confirmPrompt && !confirm('Bạn có chắc muốn thoát khỏi phòng chơi này không?')) {
      return;
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dilemma_player_v6');
      localStorage.removeItem('dilemma_player_v6');
    }
    setPlayer(null);
    setRoom(null);
    setPlayers([]);
    router.replace('/play');
  };

  // 1. MÀN HÌNH NHẬP THÔNG TIN VÀO PHÒNG
  if (!player) {
    return (
      <main className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 bg-[#FBF9F5] select-none">
        <div className="w-full max-w-md flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-bold px-2">
          <Link href="/" className="hover:text-black flex items-center gap-1">
            ← Trang chủ
          </Link>
          <span>A DILEMMA</span>
        </div>

        <div className="w-full max-w-md my-auto py-2">
          <JoinForm
            initialPin={urlPin}
            onJoin={handleJoin}
            loading={joining}
            error={joinError}
          />
        </div>

        <div />
      </main>
    );
  }

  // 2. MÀN HÌNH SẢNH CHỜ SINH VIÊN (KHI HOST CHƯA BẤM START)
  if (!room || room.status === 'LOBBY') {
    return (
      <main className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-8 select-none bg-[#FBF9F5]">
        {/* Top bar with quick exit */}
        <div className="w-full max-w-xl flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-bold px-1">
          <Link href="/" className="hover:text-black flex items-center gap-1">
            ← Trang chủ
          </Link>
          <div className="flex items-center gap-3">
            <span>PIN: <strong className="text-zinc-900">{player.pin}</strong></span>
            <button
              type="button"
              onClick={() => handleLeaveRoom(true)}
              className="text-red-600 hover:text-red-700 font-black cursor-pointer"
            >
              Thoát phòng
            </button>
          </div>
        </div>

        <div className="w-full max-w-lg mx-auto text-center my-auto py-4 px-2">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-black mb-2">
            PHÒNG CHỜ LỚP HỌC
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] mb-2">
            CHÀO MỪNG {player.name.toUpperCase()}!
          </h2>

          {player.teamName && (
            <p className="text-xs sm:text-sm text-emerald-700 font-bold mb-3">
              Đại diện cho: {player.teamName}
            </p>
          )}

          <p className="text-xs sm:text-sm text-zinc-600 mb-6 font-medium">
            Bạn đã sẵn sàng. Vui lòng nhìn lên màn hình chính của quản trò và chờ bắt đầu...
          </p>

          <div className="bg-white p-4 sm:p-5 border-2 border-zinc-200 shadow-[0_2px_0_0_#18181B] mb-6">
            <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-3">
              Thành viên trong phòng ({players.length} người)
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-h-48 overflow-y-auto">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="px-2.5 py-1.5 bg-zinc-100 text-xs font-bold flex items-center gap-1.5 border border-zinc-300"
                >
                  {p.type === 'team' ? (
                    <PixelTeam className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <PixelUser className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="truncate max-w-[140px]">{p.teamName ? `${p.teamName} (${p.name})` : p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleLeaveRoom(true)}
            className="pixel-btn w-full py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 text-xs sm:text-sm font-bold cursor-pointer"
          >
            ← Đổi mã PIN khác / Thoát ra
          </button>
        </div>

        <PixelNotificationCenter notifications={notifications} onDismiss={dismiss} />
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
      <main className="min-h-screen flex flex-col justify-between items-center p-4 sm:p-6 bg-[#FBF9F5]">
        <div className="w-full max-w-xl flex items-center justify-between text-xs sm:text-sm text-zinc-500 font-bold px-2">
          <Link href="/" className="hover:text-black">
            ← Trang chủ
          </Link>
          <button
            type="button"
            onClick={() => handleLeaveRoom(false)}
            className="text-red-600 hover:text-red-700 font-black cursor-pointer"
          >
            Thoát phòng
          </button>
        </div>

        <ThankYouScreen
          playerName={player.name}
          teamName={player.teamName}
          rational={localRational}
          emotional={100 - localRational}
          onResetPlayer={() => handleLeaveRoom(false)}
        />

        <div />
      </main>
    );
  }

  // 4. MÀN HÌNH ĐANG CHƠI (VÒNG 1, TWIST 1, TWIST 2)
  return (
    <main className="min-h-screen relative flex flex-col justify-between p-3 sm:p-6 select-none bg-[#FBF9F5] overflow-x-hidden">
      {/* Top Bar with exit option */}
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between text-xs sm:text-sm text-zinc-600 font-bold px-1">
        <button
          type="button"
          onClick={() => handleLeaveRoom(true)}
          className="text-zinc-500 hover:text-red-600 cursor-pointer flex items-center gap-1"
        >
          ← Thoát
        </button>
        <div>
          PIN: <span className="font-black text-black">{player.pin}</span> · {player.name}
        </div>
        <div className="font-mono text-base sm:text-xl font-black text-[#18181B] bg-zinc-100 px-2.5 py-1 border border-zinc-300">
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

      {/* Main Interactive Stage - Responsive on mobile */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 sm:py-4">
        <div className="w-full max-w-2xl text-center px-1">
          <div className="text-xs sm:text-sm uppercase tracking-wider text-zinc-500 font-black mb-1">
            {room.status === 'ROUND_1' && 'Vòng 1: Tình huống gốc (60s)'}
            {room.status === 'TWIST_1' && 'Vòng 2: Breaking News 1 (30s)'}
            {room.status === 'TWIST_2' && 'Vòng 3: Breaking News 2 (30s)'}
          </div>

          {/* Scale with player coins - Responsive scale width */}
          <div className="my-1 sm:my-2 pointer-events-none">
            <PixelScale
              rationalAmount={localRational}
              emotionalAmount={100 - localRational}
              tiltAngle={tiltAngle}
              size="md"
              showCoins
            />
          </div>

          {/* Interactive Ratio Slider - Responsive */}
          <RatioSlider
            rational={localRational}
            onChange={handleSliderChange}
            disabled={!room.timerRunning}
          />
        </div>
      </div>

      <PixelNotificationCenter notifications={notifications} onDismiss={dismiss} />
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
