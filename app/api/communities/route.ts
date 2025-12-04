import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// 1. GET ALL COMMUNITIES
export async function GET() {
  try {
    const communities = await dbService.communities.getAll();
    return NextResponse.json(communities);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch communities" }, { status: 500 });
  }
}

// 2. CREATE A COMMUNITY
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, handle, description, imageUrl } = body;

    if (!name || !handle || !imageUrl) {
      return NextResponse.json({ error: "Name, handle, and Image URL are required" }, { status: 400 });
    }

    // Check if handle already exists
    const existingCommunities = await dbService.communities.getAll();
    const handleExists = existingCommunities.some(
      (c) => c.handle && c.handle.toLowerCase() === handle.toLowerCase()
    );

    if (handleExists) {
      return NextResponse.json(
        { error: "This handle is already taken. Please choose another one." },
        { status: 409 }
      );
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'communities'), {
      name,
      handle: handle.toLowerCase(),
      description: description || "",
      imageUrl,
      memberCount: 0,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      message: "Community created!", 
      id: docRef.id 
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to create community" }, { status: 500 });
  }
}