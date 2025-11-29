import { User, Community, Event } from './types';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';

const CURRENT_LOGGED_IN_USER_ID = 'user-1'; // hapus pas udah ada login signup signout

export async function getProfileData() {
  //ini fetch dari database
  let user: User;
  let communities: Community[] = [];
  let events: Event[] = [];

  try {
    // 1. FETCH USER
    const userRef = doc(db, 'users', CURRENT_LOGGED_IN_USER_ID);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      user = userSnap.data() as User;
    } else {
      throw new Error("User not found");
    }

    // 2. FETCH COMMUNITIES (Based on IDs in user profile)
    // Check if user has joined any communities first to avoid errors
    if (user.joinedCommunityIds && user.joinedCommunityIds.length > 0) {
      // Query: "Select * from communities where ID is in [user.joinedCommunityIds]"
      const commQuery = query(
        collection(db, 'communities'), 
        where(documentId(), 'in', user.joinedCommunityIds)
      );
      
      const commSnap = await getDocs(commQuery);
      communities = commSnap.docs.map(doc => doc.data() as Community);
    }

    // 3. FETCH EVENTS (Based on IDs in user profile)
    if (user.rsvpEventIds && user.rsvpEventIds.length > 0) {
      const eventQuery = query(
        collection(db, 'events'), 
        where(documentId(), 'in', user.rsvpEventIds)
      );
      
      const eventSnap = await getDocs(eventQuery);
      events = eventSnap.docs.map(doc => {
        const data = doc.data();
        return{
          id: doc.id,
          name: data.name,
          date: data.date.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          communityName: data.communityName,
          href: data.href
        } as Event;
      });
    }

  } catch (error) {
    console.error("Error fetching data:", error);
    // Fallback data so the app doesn't crash while you are setting up DB
    return { 
      user: { id: 'error', name: 'Error Loading', avatarUrl: '', joinDate: '' }, 
      communities: [], 
      events: [] 
    };
  }

  return { user, communities, events };
}