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
    console.log('Received body:', { ...body, imageUrl: body.imageUrl?.substring(0, 50), bannerUrl: body.bannerUrl?.substring(0, 50) });
    
    const { name, handle, description, imageUrl, bannerUrl } = body;

    if (!name || !handle || !imageUrl) {
      console.log('Validation failed:', { name: !!name, handle: !!handle, imageUrl: !!imageUrl });
      return NextResponse.json({ error: "Name, handle, and Image URL are required" }, { status: 400 });
    }

    console.log('Checking for duplicate handle:', handle);
    // Check if handle already exists
    const existingCommunities = await dbService.communities.getAll();
    const handleExists = existingCommunities.some(
      (c) => c.handle && c.handle.toLowerCase() === handle.toLowerCase()
    );

    if (handleExists) {
      console.log('Handle already exists:', handle);
      return NextResponse.json(
        { error: "This handle is already taken. Please choose another one." },
        { status: 409 }
      );
    }

    console.log('Creating community in Firestore...');
    // Add to Firestore
    const communityData: any = {
      name,
      handle: handle.toLowerCase(),
      description: description || "",
      imageUrl,
      memberCount: 0,
      createdAt: new Date().toISOString()
    };

    // Add bannerUrl only if provided
    if (bannerUrl) {
      communityData.bannerUrl = bannerUrl;
    }

    const docRef = await addDoc(collection(db, 'communities'), communityData);
    console.log('Community created with ID:', docRef.id);

    return NextResponse.json({ 
      message: "Community created!", 
      id: docRef.id 
    });

  } catch (error: any) {
    console.error('Error creating community:', error);
    console.error('Error message:', error?.message);
    console.error('Error stack:', error?.stack);
    return NextResponse.json({ 
      error: "Failed to create community", 
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}