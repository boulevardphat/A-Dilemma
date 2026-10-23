import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'A Dilemma - 8-Bit Journalism',
    sync: 'Firebase Firestore Realtime',
  });
}
