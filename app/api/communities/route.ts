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
    const { name, description, imageUrl } = body;

    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Name and Image URL are required" }, { status: 400 });
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'communities'), {
      name,
      description: description || "", // Handle optional description
      imageUrl,
      memberCount: 0, // Start with 0 members
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