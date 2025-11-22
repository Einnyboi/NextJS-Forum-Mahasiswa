// import { db } from "@/lib/firebase";
// import { doc, getDoc, addDoc, collection } from "firebase/firestore";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const body = await request.json();
//   const { name, date, communityId } = body; // User only sent these

//   // 1. AUTOMATIC STEP: Fetch the Community Info
//   // We use the ID to get the "Official Name" from the database
//   const communityRef = doc(db, 'communities', communityId);
//   const communitySnap = await getDoc(communityRef);

//   if (!communitySnap.exists()) {
//     return NextResponse.json({ error: "Community not found" }, { status: 404 });
//   }

//   const communityData = communitySnap.data();

//   // 2. SAVE THE EVENT (Denormalization)
//   // We copy the 'communityName' into the event forever.
//   // This creates that "static" variable you mentioned.
//   await addDoc(collection(db, 'events'), {
//     name: name,
//     date: date,
//     communityId: communityId,       // Link for the database
//     communityName: communityData.name, // Link for the UI (The static text)
//     href: `/events/${new_generated_id}`
//   });

//   return NextResponse.json({ message: "Event created!" });
// }