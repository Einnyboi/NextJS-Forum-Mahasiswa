// app/api/communities/leave/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService as db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, communityId } = body;

    if (!userId || !communityId) {
      return NextResponse.json(
        { message: 'Missing userId or communityId' },
        { status: 400 }
      );
    }

    // Verify user and community exist
    const user = await db.users.getById(userId);
    const community = await db.communities.getById(communityId);

    if (!user || !community) {
      return NextResponse.json(
        { message: 'User or community not found' },
        { status: 404 }
      );
    }

    // Check if user is a member
    const isMember = await db.communities.isMember(userId, communityId);
    if (!isMember) {
      return NextResponse.json(
        { message: 'User is not a member of this community' },
        { status: 400 }
      );
    }

    const result = await db.communities.leave(userId, communityId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error leaving community:', error);
    return NextResponse.json(
      { message: 'Failed to leave community' },
      { status: 500 }
    );
  }
}
