import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateRoom, getClientState } from '@/lib/game-store';

export async function GET() {
  const defaultRoom = getOrCreateRoom('1925');
  return NextResponse.json(getClientState(defaultRoom));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = (body.code || '1925').trim().toUpperCase();
    const room = getOrCreateRoom(code);
    return NextResponse.json({ success: true, room: getClientState(room) });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
