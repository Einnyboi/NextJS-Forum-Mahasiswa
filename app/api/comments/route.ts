// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { message: 'Missing postId' },
        { status: 400 }
      );
    }

    const comments = await db.comments.getByPost(postId);
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}
