import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateRoom,
  getClientState,
  joinPlayer,
  submitVote,
  setRound,
  triggerTimer,
  continueRound,
  resetGame,
  simulateClassVotes,
} from '@/lib/game-store';
import { RoundType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const url = new URL(req.url);
  const playerId = url.searchParams.get('playerId') || undefined;
  const playerName = url.searchParams.get('name') || undefined;
  const playerType = (url.searchParams.get('type') as 'individual' | 'team') || 'individual';
  const teamName = url.searchParams.get('teamName') || undefined;

  const room = getOrCreateRoom(code);

  if (playerId && playerName && !room.players[playerId]) {
    joinPlayer(code, {
      id: playerId,
      name: playerName,
      type: playerType,
      teamName,
    });
  }

  const clientState = getClientState(room, playerId);

  return NextResponse.json(clientState, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const body = await req.json();
    const action = body.action;

    const room = getOrCreateRoom(code);

    switch (action) {
      case 'join': {
        const player = joinPlayer(code, {
          id: body.id,
          name: body.name,
          type: body.type,
          teamName: body.teamName,
          avatar: body.avatar,
        });
        return NextResponse.json({
          success: true,
          player,
          room: getClientState(room, player.id),
        });
      }

      case 'vote': {
        const ok = submitVote(code, body.playerId, body.rational);
        return NextResponse.json({
          success: ok,
          room: getClientState(room, body.playerId),
        });
      }

      case 'continue':
      case 'continue_round': {
        continueRound(code);
        return NextResponse.json({
          success: true,
          room: getClientState(room),
        });
      }

      case 'set_round': {
        const targetRound = body.round as RoundType;
        setRound(code, targetRound);
        return NextResponse.json({
          success: true,
          room: getClientState(room),
        });
      }

      case 'toggle_timer': {
        const start = Boolean(body.start);
        triggerTimer(code, start);
        return NextResponse.json({
          success: true,
          room: getClientState(room),
        });
      }

      case 'reset': {
        resetGame(code);
        return NextResponse.json({
          success: true,
          room: getClientState(room),
        });
      }

      case 'simulate': {
        simulateClassVotes(code, body.count || 12);
        return NextResponse.json({
          success: true,
          room: getClientState(room),
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Hành động không hợp lệ' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
