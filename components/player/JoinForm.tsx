import React, { useState, useEffect } from 'react';
import { PlayerMode } from '@/lib/types';
import { PixelPointerHand } from '../pixel/PixelIcons';
import { sound } from '@/lib/sound';

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
    <div className="w-full max-w-md mx-auto text-[#18181B] py-8 px-6 select-none bg-white border-2 border-zinc-200 shadow-[0_3px_0_0_#18181B]">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black mb-1">A DILEMMA</h1>
        <div className="h-0.5 w-16 bg-amber-400 mx-auto mt-2" />
      </div>

      {(validationMsg || error) && (
        <div className="mb-4 text-xs font-bold text-red-600 text-center bg-red-50 border border-red-200 py-2.5 px-3">
          {validationMsg || error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-700 mb-1.5">
            Mã PIN phòng chơi
          </label>
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.toUpperCase())}
            placeholder="Ví dụ: 849201..."
            maxLength={10}
            className="pixel-input w-full px-4 py-3 text-lg font-black tracking-widest text-center"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-zinc-700 mb-1.5">
            Tên của bạn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Họ và tên..."
            maxLength={40}
            className="pixel-input w-full px-4 py-3 text-sm font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-zinc-700 mb-1.5">
            Hình thức tham gia
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('individual');
              }}
              className={`pixel-btn py-2.5 text-xs font-bold cursor-pointer ${
                mode === 'individual'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}
            >
              Cá nhân
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMode('team');
              }}
              className={`pixel-btn py-2.5 text-xs font-bold cursor-pointer ${
                mode === 'team'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-zinc-200 text-zinc-800 hover:bg-zinc-300'
              }`}
            >
              Đại diện Nhóm
            </button>
          </div>
        </div>

        {mode === 'team' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-bold uppercase text-zinc-700 mb-1.5">
              Tên nhóm
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Ví dụ: Nhóm Phóng Viên..."
              maxLength={40}
              className="pixel-input w-full px-4 py-3 text-sm font-bold"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          onClick={() => sound.playClick()}
          className="pixel-btn w-full mt-6 py-4 bg-[#18181B] text-white hover:bg-zinc-800 font-black text-base tracking-wider flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-[0_3px_0_0_#000]"
        >
          {loading ? (
            <span>ĐANG VÀO PHÒNG...</span>
          ) : (
            <>
              <PixelPointerHand className="w-5 h-5 text-amber-400" />
              <span>VÀO PHÒNG CHƠI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
