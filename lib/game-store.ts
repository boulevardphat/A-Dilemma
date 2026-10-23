import { GameRoom, Player, RoundType, TwistInfo, ClientRoomState, RoundHistoryEntry } from './types';

const globalForRooms = globalThis as unknown as {
  __GAME_ROOMS__?: Map<string, GameRoom>;
};

if (!globalForRooms.__GAME_ROOMS__) {
  globalForRooms.__GAME_ROOMS__ = new Map<string, GameRoom>();
}

const rooms = globalForRooms.__GAME_ROOMS__;

export const TWISTS: Record<1 | 2, TwistInfo> = {
  1: {
    id: 1,
    title: 'BREAKING NEWS 01: DANH TÍNH 2 BỆNH NHÂN',
    headline: 'TIẾT LỘ QUÁ KHỨ BẤT NGỜ CỦA HAI NGƯỜI BỆNH',
    details: 'Báo chí vừa xác minh: Bệnh nhân 1 là người phạm pháp nhiều lần vừa mới mãn hạn tù. Trong khi đó, Bệnh nhân 2 là một sinh viên nghèo hiếu học với thành tích xuất sắc.',
    highlightText: 'BN1: Tiền án tiền sự, vừa ra tù | BN2: Sinh viên nghèo, thành tích xuất sắc',
    duration: 30,
  },
  2: {
    id: 2,
    title: 'BREAKING NEWS 02: BƯỚC NGOẶT Y KHOA',
    headline: 'KHÁNG THỂ HIẾM CHẾ TẠO VACCINE & BỆNH ÁN UNG THƯ',
    details: 'Xét nghiệm mới nhất cho thấy Bệnh nhân 1 mang kháng thể cực hiếm, nếu trị dứt điểm có thể hiến huyết tương chế tạo vaccine cứu hàng ngàn người. Bệnh nhân 2 thực chất đã bị ung thư giai đoạn cuối, tiên lượng chỉ sống thêm được vài tháng.',
    highlightText: 'BN1: Kháng thể hiếm chế vaccine | BN2: Ung thư giai đoạn cuối (vài tháng)',
    duration: 30,
  },
};

export const ROUND_INFO: Record<RoundType, { title: string; description: string; duration: number }> = {
  LOBBY: {
    title: 'PHÒNG CHỜ THAM GIA',
    description: 'Người chơi đang tham gia vào phòng. Quản trò sẽ bấm bắt đầu khi lớp đã sẵn sàng.',
    duration: 0,
  },
  ROUND_1: {
    title: 'GIAI ĐOẠN 1: TÌNH HUỐNG GỐC (60S)',
    description: 'Có 2 bệnh nhân nhiễm bệnh đang chuyển biến tiêu cực. Bạn có 100 giá Đại lộ (10 đồng xu). Hãy phân bổ giữa Lý trí (Trị dứt điểm 1 người) và Tình cảm (Trị cầm chừng cả 2).',
    duration: 60,
  },
  TWIST_1: {
    title: 'GIAI ĐOẠN 2: BREAKING NEWS 1 (30S)',
    description: 'Báo chí vừa tiết lộ nhân thân 2 bệnh nhân! Bạn có 30 giây để thảo luận và điều chỉnh lại đồng tiền Đại lộ trên cán cân.',
    duration: 30,
  },
  TWIST_2: {
    title: 'GIAI ĐOẠN 3: BREAKING NEWS 2 (30S)',
    description: 'Sự thật y khoa được phơi bày! Bạn có 30 giây cuối cùng để xem xét lại lập trường của mình.',
    duration: 30,
  },
  THANK_YOU: {
    title: 'HOÀN THÀNH & TỔNG KẾT',
    description: 'Cảm ơn bạn đã tham gia bỏ phiếu! Cán cân đã được khóa. Hãy theo dõi màn hình chính để nghe phân tích.',
    duration: 0,
  },
};

export function calculateTiltAngle(totalRational: number, totalEmotional: number): number {
  const total = totalRational + totalEmotional;
  if (total === 0) return 0;
  const diff = totalEmotional - totalRational;
  const ratio = diff / total;
  return Math.round(ratio * 25 * 10) / 10;
}

export function getOrCreateRoom(code: string = 'CLASS'): GameRoom {
  const normalizedCode = (code || 'CLASS').trim().toUpperCase();
  let room = rooms.get(normalizedCode);
  if (!room) {
    room = {
      code: normalizedCode,
      createdAt: Date.now(),
      status: 'LOBBY',
      roundTitle: ROUND_INFO.LOBBY.title,
      roundDescription: ROUND_INFO.LOBBY.description,
      timerTotal: 60,
      timerRemaining: 60,
      timerRunning: false,
      timerStartedAt: null,
      timerEndsAt: null,
      twist: null,
      players: {},
      history: [],
    };
    rooms.set(normalizedCode, room);
  }
  return room;
}

export function recordRoundHistory(room: GameRoom): void {
  const { totalRational, totalEmotional } = getRoomTotals(room);
  const total = totalRational + totalEmotional;
  const percentRational = total > 0 ? Math.round((totalRational / total) * 100) : 50;
  const percentEmotional = total > 0 ? 100 - percentRational : 50;
  const tiltAngle = calculateTiltAngle(totalRational, totalEmotional);

  const existing = room.history.find((h) => h.round === room.status);
  const entry: RoundHistoryEntry = {
    round: room.status,
    label: ROUND_INFO[room.status].title,
    timestamp: Date.now(),
    totalRational,
    totalEmotional,
    percentRational,
    percentEmotional,
    tiltAngle,
    playerCount: Object.keys(room.players).length,
  };

  if (existing) {
    Object.assign(existing, entry);
  } else {
    room.history.push(entry);
  }
}

export function syncRoomTimer(room: GameRoom): void {
  if (room.timerRunning && room.timerEndsAt) {
    const now = Date.now();
    const remainingMs = Math.max(0, room.timerEndsAt - now);
    room.timerRemaining = Math.ceil(remainingMs / 1000);

    if (remainingMs <= 0) {
      room.timerRunning = false;
      room.timerRemaining = 0;
      room.timerStartedAt = null;
      room.timerEndsAt = null;
      recordRoundHistory(room);

      if (room.status === 'ROUND_1') {
        room.status = 'TWIST_1';
        room.roundTitle = ROUND_INFO.TWIST_1.title;
        room.roundDescription = ROUND_INFO.TWIST_1.description;
        room.twist = TWISTS[1];
        room.timerTotal = 30;
        room.timerRemaining = 30;
        room.timerRunning = false;
      } else if (room.status === 'TWIST_1') {
        room.status = 'TWIST_2';
        room.roundTitle = ROUND_INFO.TWIST_2.title;
        room.roundDescription = ROUND_INFO.TWIST_2.description;
        room.twist = TWISTS[2];
        room.timerTotal = 30;
        room.timerRemaining = 30;
        room.timerRunning = false;
      } else if (room.status === 'TWIST_2') {
        room.status = 'THANK_YOU';
        room.roundTitle = ROUND_INFO.THANK_YOU.title;
        room.roundDescription = ROUND_INFO.THANK_YOU.description;
        room.twist = null;
        room.timerTotal = 0;
        room.timerRemaining = 0;
        room.timerRunning = false;
      }
    }
  }
}

export function getRoomTotals(room: GameRoom): { totalRational: number; totalEmotional: number } {
  let totalRational = 0;
  let totalEmotional = 0;
  for (const player of Object.values(room.players)) {
    totalRational += player.rational;
    totalEmotional += player.emotional;
  }
  return { totalRational, totalEmotional };
}

export function getClientState(room: GameRoom, playerId?: string): ClientRoomState {
  syncRoomTimer(room);
  const { totalRational, totalEmotional } = getRoomTotals(room);
  const total = totalRational + totalEmotional;
  const percentRational = total > 0 ? Math.round((totalRational / total) * 100) : 50;
  const percentEmotional = total > 0 ? 100 - percentRational : 50;
  const tiltAngle = calculateTiltAngle(totalRational, totalEmotional);

  const playersArray = Object.values(room.players);

  return {
    code: room.code,
    status: room.status,
    roundTitle: room.roundTitle,
    roundDescription: room.roundDescription,
    timerTotal: room.timerTotal,
    timerRemaining: room.timerRemaining,
    timerRunning: room.timerRunning,
    twist: room.twist,
    playerCount: playersArray.length,
    totalRational,
    totalEmotional,
    percentRational,
    percentEmotional,
    tiltAngle,
    myVote: playerId && room.players[playerId]
      ? { rational: room.players[playerId].rational, emotional: room.players[playerId].emotional }
      : undefined,
    playersList: playersArray.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      teamName: p.teamName,
      avatar: p.avatar,
      rational: p.rational,
      emotional: p.emotional,
    })),
    history: room.history,
  };
}

export function joinPlayer(
  roomCode: string,
  playerData: { id: string; name: string; type: 'individual' | 'team'; teamName?: string; avatar?: string }
): Player {
  const room = getOrCreateRoom(roomCode);
  const existing = room.players[playerData.id];

  const player: Player = {
    id: playerData.id,
    name: playerData.name.trim() || 'Người chơi 8-bit',
    type: playerData.type || 'individual',
    teamName: playerData.teamName?.trim(),
    avatar: playerData.avatar || 'typewriter',
    rational: existing ? existing.rational : 50,
    emotional: existing ? existing.emotional : 50,
    joinedAt: existing ? existing.joinedAt : Date.now(),
    lastActive: Date.now(),
  };

  room.players[playerData.id] = player;
  return player;
}

export function submitVote(roomCode: string, playerId: string, rational: number): boolean {
  const room = getOrCreateRoom(roomCode);
  const player = room.players[playerId];
  if (!player) return false;

  const clampedRational = Math.max(0, Math.min(100, Math.round(rational / 10) * 10));
  player.rational = clampedRational;
  player.emotional = 100 - clampedRational;
  player.lastActive = Date.now();
  return true;
}

export function continueRound(roomCode: string): GameRoom {
  const room = getOrCreateRoom(roomCode);
  syncRoomTimer(room);

  if (room.status === 'LOBBY') {
    room.status = 'ROUND_1';
    room.roundTitle = ROUND_INFO.ROUND_1.title;
    room.roundDescription = ROUND_INFO.ROUND_1.description;
    room.twist = null;
    room.timerTotal = 60;
    room.timerRemaining = 60;
    room.timerRunning = true;
    room.timerStartedAt = Date.now();
    room.timerEndsAt = Date.now() + 60 * 1000;
  } else if (room.status === 'TWIST_1') {
    room.timerTotal = 30;
    room.timerRemaining = 30;
    room.timerRunning = true;
    room.timerStartedAt = Date.now();
    room.timerEndsAt = Date.now() + 30 * 1000;
  } else if (room.status === 'TWIST_2') {
    room.timerTotal = 30;
    room.timerRemaining = 30;
    room.timerRunning = true;
    room.timerStartedAt = Date.now();
    room.timerEndsAt = Date.now() + 30 * 1000;
  }

  return room;
}

export function setRound(roomCode: string, targetRound: RoundType): GameRoom {
  const room = getOrCreateRoom(roomCode);
  recordRoundHistory(room);

  room.status = targetRound;
  room.roundTitle = ROUND_INFO[targetRound].title;
  room.roundDescription = ROUND_INFO[targetRound].description;
  room.timerTotal = ROUND_INFO[targetRound].duration;
  room.timerRemaining = ROUND_INFO[targetRound].duration;
  room.timerRunning = false;
  room.timerStartedAt = null;
  room.timerEndsAt = null;

  if (targetRound === 'TWIST_1') {
    room.twist = TWISTS[1];
  } else if (targetRound === 'TWIST_2') {
    room.twist = TWISTS[2];
  } else if (targetRound === 'LOBBY' || targetRound === 'ROUND_1' || targetRound === 'THANK_YOU') {
    room.twist = null;
  }

  return room;
}

export function triggerTimer(roomCode: string, start: boolean): GameRoom {
  const room = getOrCreateRoom(roomCode);
  if (start) {
    if (room.timerRemaining <= 0) {
      room.timerRemaining = room.timerTotal || 30;
    }
    room.timerRunning = true;
    room.timerStartedAt = Date.now();
    room.timerEndsAt = Date.now() + room.timerRemaining * 1000;
  } else {
    syncRoomTimer(room);
    room.timerRunning = false;
    room.timerStartedAt = null;
    room.timerEndsAt = null;
  }
  return room;
}

export function resetGame(roomCode: string): GameRoom {
  const room = getOrCreateRoom(roomCode);
  room.status = 'LOBBY';
  room.roundTitle = ROUND_INFO.LOBBY.title;
  room.roundDescription = ROUND_INFO.LOBBY.description;
  room.timerTotal = 60;
  room.timerRemaining = 60;
  room.timerRunning = false;
  room.timerStartedAt = null;
  room.timerEndsAt = null;
  room.twist = null;
  room.history = [];

  for (const player of Object.values(room.players)) {
    player.rational = 50;
    player.emotional = 50;
  }
  return room;
}

export function simulateClassVotes(roomCode: string, count: number = 12): void {
  const room = getOrCreateRoom(roomCode);
  const sampleNames = [
    { name: 'Minh Hoàng', type: 'individual' as const, avatar: 'pen' },
    { name: 'Bảo Trâm', type: 'individual' as const, avatar: 'typewriter' },
    { name: 'Nhóm Tin Tức 01', type: 'team' as const, teamName: 'Nhóm Tin Tức 01', avatar: 'press' },
    { name: 'Anh Quân', type: 'individual' as const, avatar: 'lens' },
    { name: 'Nhóm Phóng Viên Trẻ', type: 'team' as const, teamName: 'Nhóm Phóng Viên Trẻ', avatar: 'radio' },
    { name: 'Hải Đăng', type: 'individual' as const, avatar: 'pen' },
    { name: 'Kim Ngân', type: 'individual' as const, avatar: 'typewriter' },
    { name: 'Nhóm Sự Thật', type: 'team' as const, teamName: 'Nhóm Sự Thật', avatar: 'press' },
    { name: 'Quốc Bảo', type: 'individual' as const, avatar: 'lens' },
    { name: 'Thùy Chi', type: 'individual' as const, avatar: 'radio' },
    { name: 'Nhóm Độc Lập', type: 'team' as const, teamName: 'Nhóm Độc Lập', avatar: 'press' },
    { name: 'Phương Linh', type: 'individual' as const, avatar: 'typewriter' },
  ];

  sampleNames.slice(0, count).forEach((item, index) => {
    const id = `demo_student_${index + 1}`;
    let rational = 50;

    if (room.status === 'ROUND_1') {
      rational = Math.random() > 0.4 ? 40 : 60;
    } else if (room.status === 'TWIST_1') {
      rational = Math.random() > 0.25 ? 20 : 30;
    } else if (room.status === 'TWIST_2') {
      rational = Math.random() > 0.2 ? 80 : 70;
    }

    room.players[id] = {
      id,
      name: item.name,
      type: item.type,
      teamName: item.teamName,
      avatar: item.avatar,
      rational,
      emotional: 100 - rational,
      joinedAt: Date.now() - index * 1000,
      lastActive: Date.now(),
    };
  });
}
