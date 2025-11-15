// app/api/profile/route.ts
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

// GET Request: Fetches user data
// Usage: /api/profile?id=user-1
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// POST Request: Saves/Updates user data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, avatarUrl} = body;

    // Reference the specific user document in the "users" collection
    const userRef = doc(db, "users", id);

    // Save the data to Firestore
    // { merge: true } means "update existing fields, don't delete the whole document"
    await setDoc(userRef, {
      id,
      name,
      avatarUrl,
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}