import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  Unsubscribe,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { GameRoom, Player, PlayerMode, RoundType, TwistInfo } from './types';

export const TWISTS: Record<1 | 2, TwistInfo> = {
  1: {
    id: 1,
    title: 'BREAKING NEWS 01: DANH TÍNH 2 BỆNH NHÂN',
    headline: 'TIẾT LỘ QUÁ KHỨ BẤT NGỜ CỦA HAI NGƯỜI BỆNH',
    details:
      'Báo chí vừa xác minh: Bệnh nhân 1 là người phạm pháp nhiều lần vừa mới mãn hạn tù. Trong khi đó, Bệnh nhân 2 là một sinh viên nghèo hiếu học với thành tích xuất sắc.',
    highlightText: 'BN1: Tiền án tiền sự, vừa ra tù · BN2: Sinh viên nghèo, thành tích xuất sắc',
    duration: 30,
  },
  2: {
    id: 2,
    title: 'BREAKING NEWS 02: BƯỚC NGOẶT Y KHOA',
    headline: 'KHÁNG THỂ HIẾM CHẾ TẠO VACCINE & BỆNH ÁN UNG THƯ',
    details:
      'Xét nghiệm mới nhất cho thấy Bệnh nhân 1 mang kháng thể cực hiếm, nếu trị dứt điểm có thể hiến huyết tương chế tạo vaccine cứu hàng ngàn người. Bệnh nhân 2 thực chất đã bị ung thư giai đoạn cuối, tiên lượng chỉ sống thêm được vài tháng.',
    highlightText: 'BN1: Kháng thể hiếm chế vaccine · BN2: Ung thư giai đoạn cuối (vài tháng)',
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
    description:
      'Có 2 bệnh nhân nhiễm bệnh đang chuyển biến tiêu cực. Bạn có 100 giá Đại lộ (10 đồng xu). Hãy phân bổ giữa Lý trí (Trị dứt điểm 1 người) và Tình cảm (Trị cầm chừng cả 2).',
    duration: 60,
  },
  TWIST_1: {
    title: 'GIAI ĐOẠN 2: BREAKING NEWS 1 (30S)',
    description:
      'Báo chí vừa tiết lộ nhân thân 2 bệnh nhân! Bạn có 30 giây để thảo luận và điều chỉnh lại đồng tiền Đại lộ trên cán cân.',
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

export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function calculateTiltAngle(totalRational: number, totalEmotional: number): number {
  const total = totalRational + totalEmotional;
  if (total === 0) return 0;
  const diff = totalEmotional - totalRational;
  const ratio = diff / total;
  return Math.round(ratio * 25 * 10) / 10;
}

export async function createRoom(customPin?: string): Promise<string> {
  const pin = customPin || generatePin();
  const roomRef = doc(db, 'rooms', pin);

  const initialData: Omit<GameRoom, 'players'> = {
    code: pin,
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
    history: [],
    resetAt: Date.now(),
    expiresAt: Date.now() + 2 * 60 * 60 * 1000,
    deleted: false,
  };

  await setDoc(roomRef, initialData, { merge: true });
  return pin;
}

export async function deleteRoom(pin: string): Promise<void> {
  const cleanPin = (pin || '').trim().toUpperCase();
  if (!cleanPin) return;
  try {
    const roomRef = doc(db, 'rooms', cleanPin);
    await updateDoc(roomRef, { deleted: true }).catch(() => {});
    await deleteDoc(roomRef).catch(() => {});
  } catch (err) {
    console.error('deleteRoom error:', err);
  }
}

export function subscribeRoom(pin: string, callback: (room: GameRoom | null) => void): Unsubscribe {
  const roomRef = doc(db, 'rooms', pin);
  return onSnapshot(
    roomRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as GameRoom;
        const now = Date.now();
        const isExpired = data.expiresAt ? now > data.expiresAt : now - data.createdAt > 2 * 60 * 60 * 1000;
        if (data.deleted || isExpired) {
          callback(null);
        } else {
          callback({ ...data, players: data.players || {} });
        }
      } else {
        callback(null);
      }
    },
    (err) => {
      console.error('Firestore subscribeRoom error:', err);
      callback(null);
    }
  );
}

export function subscribePlayers(pin: string, callback: (players: Player[]) => void): Unsubscribe {
  const playersCol = collection(db, 'rooms', pin, 'players');
  return onSnapshot(
    playersCol,
    (snap) => {
      const list: Player[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Player);
      });
      callback(list);
    },
    (err) => {
      console.error('Firestore subscribePlayers error:', err);
      callback([]);
    }
  );
}

export async function checkRoomExists(pin: string): Promise<boolean> {
  const cleanPin = (pin || '').trim().toUpperCase();
  if (!cleanPin) return false;
  try {
    const snap = await getDoc(doc(db, 'rooms', cleanPin));
    if (snap.exists()) {
      const data = snap.data() as GameRoom;
      if (data.deleted) return false;
      const now = Date.now();
      const isExpired = data.expiresAt ? now > data.expiresAt : now - data.createdAt > 2 * 60 * 60 * 1000;
      if (isExpired) {
        deleteRoom(cleanPin).catch(() => {});
        return false;
      }
      return true;
    }

    if (cleanPin === 'CLASS') {
      await createRoom('CLASS');
      return true;
    }
    return false;
  } catch (err) {
    console.error('checkRoomExists error:', err);
    return false;
  }
}

export async function joinPlayer(
  pin: string,
  playerData: { id: string; name: string; type: PlayerMode; teamName?: string; avatar?: string }
): Promise<Player> {
  const cleanPin = (pin || '').trim().toUpperCase();
  const playerRef = doc(db, 'rooms', cleanPin, 'players', playerData.id);
  const existing = await getDoc(playerRef);

  let rational = 50;
  let emotional = 50;
  let joinedAt = Date.now();

  if (existing.exists()) {
    const d = existing.data() as Player;
    rational = typeof d.rational === 'number' ? d.rational : 50;
    emotional = typeof d.emotional === 'number' ? d.emotional : 50;
    joinedAt = d.joinedAt || Date.now();
  }

  const payload: Record<string, unknown> = {
    id: playerData.id,
    name: playerData.name.trim() || 'Người chơi 8-bit',
    type: playerData.type || 'individual',
    avatar: playerData.avatar || 'journalist',
    rational,
    emotional,
    joinedAt,
    lastActive: Date.now(),
  };

  const cleanTeamName = playerData.teamName?.trim();
  if (playerData.type === 'team' && cleanTeamName) {
    payload.teamName = cleanTeamName;
  }

  await setDoc(playerRef, payload, { merge: true });

  return {
    id: playerData.id,
    name: payload.name as string,
    type: payload.type as PlayerMode,
    teamName: payload.teamName as string | undefined,
    avatar: payload.avatar as string,
    rational,
    emotional,
    joinedAt,
    lastActive: payload.lastActive as number,
  };
}

export async function submitVote(pin: string, playerId: string, rational: number): Promise<void> {
  const clampedRational = Math.max(0, Math.min(100, Math.round(rational / 10) * 10));
  const emotional = 100 - clampedRational;

  const playerRef = doc(db, 'rooms', pin, 'players', playerId);
  await updateDoc(playerRef, {
    rational: clampedRational,
    emotional,
    lastActive: Date.now(),
  });
}

export async function hostStartGame(pin: string): Promise<void> {
  const roomRef = doc(db, 'rooms', pin);
  const now = Date.now();
  await updateDoc(roomRef, {
    status: 'ROUND_1',
    roundTitle: ROUND_INFO.ROUND_1.title,
    roundDescription: ROUND_INFO.ROUND_1.description,
    twist: null,
    timerTotal: 60,
    timerRemaining: 60,
    timerRunning: true,
    timerStartedAt: now,
    timerEndsAt: now + 60 * 1000,
    startedAt: now,
  });
}

export async function hostContinueTwist(pin: string, currentStatus: RoundType): Promise<void> {
  const roomRef = doc(db, 'rooms', pin);
  const now = Date.now();

  if (currentStatus === 'TWIST_1' || currentStatus === 'TWIST_2') {
    await updateDoc(roomRef, {
      timerTotal: 30,
      timerRemaining: 30,
      timerRunning: true,
      timerStartedAt: now,
      timerEndsAt: now + 30 * 1000,
    });
  } else if (currentStatus === 'LOBBY') {
    await hostStartGame(pin);
  }
}

export async function hostAdvanceRound(pin: string, targetRound: RoundType): Promise<void> {
  const roomRef = doc(db, 'rooms', pin);
  const duration = ROUND_INFO[targetRound].duration;

  const updatePayload: Record<string, unknown> = {
    status: targetRound,
    roundTitle: ROUND_INFO[targetRound].title,
    roundDescription: ROUND_INFO[targetRound].description,
    timerTotal: duration,
    timerRemaining: duration,
    timerRunning: false,
    timerStartedAt: null,
    timerEndsAt: null,
  };

  if (targetRound === 'TWIST_1') {
    updatePayload.twist = TWISTS[1];
  } else if (targetRound === 'TWIST_2') {
    updatePayload.twist = TWISTS[2];
  } else {
    updatePayload.twist = null;
  }

  await updateDoc(roomRef, updatePayload);
}

export async function hostToggleTimer(pin: string, currentRunning: boolean, remaining: number): Promise<void> {
  const roomRef = doc(db, 'rooms', pin);
  if (!currentRunning) {
    const sec = remaining > 0 ? remaining : 30;
    const now = Date.now();
    await updateDoc(roomRef, {
      timerRunning: true,
      timerStartedAt: now,
      timerEndsAt: now + sec * 1000,
    });
  } else {
    await updateDoc(roomRef, {
      timerRunning: false,
      timerStartedAt: null,
      timerEndsAt: null,
      timerRemaining: remaining,
    });
  }
}

export async function hostResetRoom(pin: string): Promise<void> {
  const roomRef = doc(db, 'rooms', pin);
  await updateDoc(roomRef, {
    status: 'LOBBY',
    roundTitle: ROUND_INFO.LOBBY.title,
    roundDescription: ROUND_INFO.LOBBY.description,
    timerTotal: 60,
    timerRemaining: 60,
    timerRunning: false,
    timerStartedAt: null,
    timerEndsAt: null,
    twist: null,
    history: [],
    resetAt: Date.now(),
    startedAt: null,
  });
}

export async function hostSimulateClass(pin: string, count: number = 12): Promise<void> {
  const sampleNames = [
    { name: 'Minh Hoàng', type: 'individual' as const, avatar: 'owl' },
    { name: 'Bảo Trâm', type: 'individual' as const, avatar: 'cat' },
    { name: 'Nhóm Tin Tức 01', type: 'team' as const, teamName: 'Nhóm Tin Tức 01', avatar: 'fox' },
    { name: 'Anh Quân', type: 'individual' as const, avatar: 'bot' },
    { name: 'Nhóm Phóng Viên Trẻ', type: 'team' as const, teamName: 'Nhóm Phóng Viên Trẻ', avatar: 'pigeon' },
    { name: 'Hải Đăng', type: 'individual' as const, avatar: 'dino' },
    { name: 'Kim Ngân', type: 'individual' as const, avatar: 'bunny' },
    { name: 'Nhóm Sự Thật', type: 'team' as const, teamName: 'Nhóm Sự Thật', avatar: 'bear' },
    { name: 'Quốc Bảo', type: 'individual' as const, avatar: 'owl' },
    { name: 'Thùy Chi', type: 'individual' as const, avatar: 'cat' },
    { name: 'Nhóm Độc Lập', type: 'team' as const, teamName: 'Nhóm Độc Lập', avatar: 'fox' },
    { name: 'Phương Linh', type: 'individual' as const, avatar: 'bunny' },
  ];

  const batch = writeBatch(db);
  sampleNames.slice(0, count).forEach((item, index) => {
    const id = `demo_student_${index + 1}`;
    const rational = Math.random() > 0.4 ? 40 : 60;
    const playerRef = doc(db, 'rooms', pin, 'players', id);
    batch.set(playerRef, {
      id,
      name: item.name,
      type: item.type,
      teamName: item.teamName || null,
      avatar: item.avatar,
      rational,
      emotional: 100 - rational,
      joinedAt: Date.now() - index * 1000,
      lastActive: Date.now(),
    });
  });

  await batch.commit();
}

export async function updatePlayerAvatar(pin: string, playerId: string, avatar: string): Promise<void> {
  const cleanPin = (pin || '').trim().toUpperCase();
  const playerRef = doc(db, 'rooms', cleanPin, 'players', playerId);
  await updateDoc(playerRef, {
    avatar,
    lastActive: Date.now(),
  });
}

export async function hostSimulateVoteShift(pin: string): Promise<void> {
  const playersCol = collection(db, 'rooms', pin, 'players');
  const snap = await getDocs(playersCol);
  if (snap.empty) {
    await hostSimulateClass(pin, 6);
    return;
  }

  const docs = snap.docs;
  const countToChange = Math.min(docs.length, Math.floor(Math.random() * 2) + 1);
  const shuffled = [...docs].sort(() => 0.5 - Math.random()).slice(0, countToChange);

  for (const docSnap of shuffled) {
    const data = docSnap.data();
    const currentRational = typeof data.rational === 'number' ? data.rational : 50;
    const deltas = [-30, -20, -10, 10, 20, 30];
    const delta = deltas[Math.floor(Math.random() * deltas.length)];
    const newRational = Math.max(0, Math.min(100, currentRational + delta));
    await updateDoc(docSnap.ref, {
      rational: newRational,
      emotional: 100 - newRational,
      lastActive: Date.now(),
    });
  }
}

