// app/api/comments/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService as db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, authorId, content } = body;

    if (!postId || !authorId || !content) {
      return NextResponse.json(
        { message: 'Missing required fields: postId, authorId, content' },
        { status: 400 }
      );
    }

    // Fetch author info
    const author = await db.users.getById(authorId);
    if (!author) {
      return NextResponse.json(
        { message: 'Author not found' },
        { status: 404 }
      );
    }

    // Fetch post to verify it exists
    const post = await db.posts.getById(postId);
    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      );
    }

    const newComment = await db.comments.create({
      postId,
      authorId,
      content,
      authorName: author.name,
      authorAvatarUrl: author.avatarUrl,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
