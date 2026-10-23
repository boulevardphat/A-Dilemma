'use client';

import React, { useState } from 'react';
import { PlayerMode } from '@/lib/types';
import { PixelPointerHand } from '../pixel/PixelIcons';

interface JoinFormProps {
  onJoin: (data: {
    name: string;
    type: PlayerMode;
    teamName?: string;
  }) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

export function JoinForm({ onJoin, loading, error }: JoinFormProps) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState<PlayerMode>('individual');
  const [teamName, setTeamName] = useState('');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationMsg(null);

    if (!name.trim()) {
      setValidationMsg('Vui lòng nhập tên của bạn hoặc người đại diện');
      return;
    }

    if (mode === 'team' && !teamName.trim()) {
      setValidationMsg('Vui lòng nhập tên nhóm của bạn');
      return;
    }

    await onJoin({
      name: name.trim(),
      type: mode,
      teamName: mode === 'team' ? teamName.trim() : undefined,
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto text-[#18181B] py-6 px-4">
      {/* Title - Unboxed, clean */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight mb-1">
          A DILEMMA
        </h1>
        <p className="text-xs text-zinc-500 font-medium">
          trò chơi tương tác môn lịch sử báo chí
        </p>
      </div>

      {(validationMsg || error) && (
        <div className="mb-4 text-xs text-red-600 font-medium text-center">
          {validationMsg || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Name */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">
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

        {/* Mode Selector */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 mb-1.5">
            Hình thức tham gia
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('individual')}
              className={`pixel-btn py-2 text-xs font-semibold cursor-pointer ${
                mode === 'individual'
                  ? 'bg-[#18181B] text-white'
                  : 'bg-white text-[#18181B]'
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
                  : 'bg-white text-[#18181B]'
              }`}
            >
              Đại diện nhóm
            </button>
          </div>
        </div>

        {/* Conditional Team Name */}
        {mode === 'team' && (
          <div className="pt-1">
            <label className="block text-xs font-medium text-zinc-600 mb-1.5">
              Tên nhóm của bạn
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="VD: Nhóm 1, Nhóm Phóng Viên..."
              maxLength={40}
              className="pixel-input w-full px-3 py-2.5 text-sm"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="pixel-btn w-full py-3 bg-[#18181B] text-white hover:bg-zinc-800 font-bold text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PixelPointerHand className="w-4 h-4 text-amber-400" />
            <span>{loading ? 'Đang kết nối...' : 'VÀO PHÒNG CHƠI'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
