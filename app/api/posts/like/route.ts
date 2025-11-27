// app/api/posts/like/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { message: 'Missing postId' },
        { status: 400 }
      );
    }

    const post = await db.posts.like(postId);

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Post liked', post });
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { message: 'Failed to like post' },
      { status: 500 }
    );
  }
}
