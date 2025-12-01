import { NextRequest, NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, communityId } = body;

    if (!userId || !communityId) {
      return NextResponse.json(
        { error: 'User ID and Community ID are required' },
        { status: 400 }
      );
    }

    const result = await dbService.communities.leave(userId, communityId);

    if (result.success) {
      return NextResponse.json({ 
        message: 'Successfully left community',
        success: true 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to leave community', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json(
      { error: 'Failed to leave community' },
      { status: 500 }
    );
  }
}
