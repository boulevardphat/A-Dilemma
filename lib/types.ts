export type RoundType = 'LOBBY' | 'ROUND_1' | 'TWIST_1' | 'TWIST_2' | 'THANK_YOU';

export type PlayerMode = 'individual' | 'team';

export interface Player {
  id: string;
  name: string;
  type: PlayerMode;
  teamName?: string;
  rational: number; // 0 to 100 in steps of 10
  emotional: number; // 100 - rational
  avatar: string;
  joinedAt: number;
  lastActive: number;
}

export interface TwistInfo {
  id: 1 | 2;
  title: string;
  headline: string;
  details: string;
  highlightText: string;
  duration: number; // in seconds
}

export interface RoundHistoryEntry {
  round: RoundType;
  label: string;
  timestamp: number;
  totalRational: number;
  totalEmotional: number;
  percentRational: number;
  percentEmotional: number;
  tiltAngle: number;
  playerCount: number;
}

export interface GameRoom {
  code: string;
  createdAt: number;
  status: RoundType;
  roundTitle: string;
  roundDescription: string;
  timerTotal: number;
  timerRemaining: number;
  timerRunning: boolean;
  timerStartedAt: number | null;
  timerEndsAt: number | null;
  twist: TwistInfo | null;
  players: Record<string, Player>;
  history: RoundHistoryEntry[];
}

export interface ClientRoomState {
  code: string;
  status: RoundType;
  roundTitle: string;
  roundDescription: string;
  timerTotal: number;
  timerRemaining: number;
  timerRunning: boolean;
  twist: TwistInfo | null;
  playerCount: number;
  totalRational: number;
  totalEmotional: number;
  percentRational: number;
  percentEmotional: number;
  tiltAngle: number;
  myVote?: {
    rational: number;
    emotional: number;
  };
  playersList?: {
    id: string;
    name: string;
    type: PlayerMode;
    teamName?: string;
    avatar: string;
    rational: number;
    emotional: number;
  }[];
  history: RoundHistoryEntry[];
}
