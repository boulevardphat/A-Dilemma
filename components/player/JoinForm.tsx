'use client';

import React, { useState, useEffect } from 'react';
import { PlayerMode } from '@/lib/types';
import { PixelPointerHand } from '../pixel/PixelIcons';

interface JoinFormProps {
  initialPin?: string;
  onJoin: (data: {
    pin: string;
    name: string;
    type: PlayerMode;
    teamName?: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export function JoinForm({ initialPin = '', onJoin, loading, error }: JoinFormProps) {
  const [pin, setPin] = useState(initialPin);
  const [name, setName] = useState('');
  const [mode, setMode] = useState<PlayerMode>('individual');
  const [teamName, setTeamName] = useState('');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialPin) {
      setPin(initialPin);
    }
  }, [initialPin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMsg(null);

    const cleanPin = pin.trim().replace(/\s+/g, '');
    if (!cleanPin || cleanPin.length < 4) {
      setValidationMsg('Vui lòng nhập đúng mã PIN phòng chơi (6 chữ số)');
      return;
    }

    if (!name.trim()) {
      setValidationMsg('Vui lòng nhập tên của bạn hoặc người đại diện');
      return;
    }

    if (mode === 'team' && !teamName.trim()) {
      setValidationMsg('Vui lòng nhập tên nhóm của bạn');
      return;
    }

    await onJoin({
      pin: cleanPin,
      name: name.trim(),
      type: mode,
      teamName: mode === 'team' ? teamName.trim() : undefined,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto text-[#18181B] py-6 px-4 select-none">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold mb-1">A DILEMMA</h1>
        <p className="text-xs text-zinc-500 font-medium">
          trò chơi tương tác môn lịch sử báo chí
        </p>
      </div>

      {(validationMsg || error) && (
        <div className="mb-4 text-xs text-red-600 font-medium text-center bg-red-50 py-2 px-3">
          {validationMsg || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Mã PIN phòng chơi
          </label>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            placeholder="Ví dụ: 849201..."
            maxLength={10}
            className="pixel-input w-full px-3 py-2.5 text-base font-bold tracking-widest text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Tên của bạn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên..."
            maxLength={40}
            className="pixel-input w-full px-3 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Hình thức tham gia
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('individual')}
              className={`pixel-btn py-2 text-xs font-semibold cursor-pointer ${
                mode === 'individual'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}
            >
              Cá nhân
            </button>
            <button
              type="button"
              onClick={() => setMode('team')}
              className={`pixel-btn py-2 text-xs font-semibold cursor-pointer ${
                mode === 'team'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}
            >
              Đại diện Nhóm
            </button>
          </div>
        </div>

        {mode === 'team' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Tên nhóm
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ví dụ: Nhóm Phóng Viên Trẻ..."
              maxLength={40}
              className="pixel-input w-full px-3 py-2.5 text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="pixel-btn w-full mt-4 py-3.5 bg-[#18181B] text-white hover:bg-zinc-800 font-extrabold text-sm tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>ĐANG VÀO PHÒNG...</span>
          ) : (
            <>
              <PixelPointerHand className="w-4 h-4 text-amber-400" />
              <span>VÀO PHÒNG CHƠI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
