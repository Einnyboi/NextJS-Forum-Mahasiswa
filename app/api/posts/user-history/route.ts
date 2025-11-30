import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db'; 
import { Post } from '@/lib/types'; 

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); 

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // Menggunakan fungsi getByAuthor yang sudah ada di lib/db.ts
        const posts: Post[] = await dbService.posts.getByAuthor(userId);
        
        return NextResponse.json(posts); 

    } catch (error) {
        console.error("Error fetching user history:", error);
        return NextResponse.json({ message: 'Failed to fetch user posts' }, { status: 500 });
    }
}