// app/api/posts/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbService as db } from '@/lib/db';
import { Post } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, tag, communityId, authorId } = body;

    if (!title || !content || !communityId || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch Community Info
    const community = await db.communities.getById(communityId);
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    // Fetch Author Info
    const author = await db.users.getById(authorId);
    if (!author) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the post with denormalized data
    const newPost: Omit<Post, 'id' | 'createdAt' | 'likeCount' | 'commentCount'> = {
      communityId,
      authorId,
      communityName: community.name,
      communityImageUrl: community.imageUrl,
      authorName: author.name,
      authorAvatarUrl: author.avatarUrl,
      title,
      content,
      tag: tag || null,
    };

    const post = await db.posts.create(newPost);

    return NextResponse.json({ 
      message: "Post created successfully!", 
      post 
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}