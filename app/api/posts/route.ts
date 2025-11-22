// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const communityId = searchParams.get('communityId');

    let posts;
    if (communityId) {
      posts = await db.posts.getByCommunity(communityId);
    } else {
      posts = await db.posts.getAll();
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { message: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
