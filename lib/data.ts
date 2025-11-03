import { User, Community, Event, Post } from './types';

// --- SAMPLE DATABASE ---

const allUsers: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice', joinDate: 'March 2024' },
  { id: 'user-2', name: 'Bob Smith', avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Bob', joinDate: 'May 2024' },
];

const allCommunities: Community[] = [
  { id: 'comm-1', name: 'Next.js Devs', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=NextJS' },
  { id: 'comm-2', name: 'Data Structures Club', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Data' },
  { id: 'comm-3', name: 'University Gaming', imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Gaming' },
];

const allEvents: Event[] = [
  { id: 'event-1', name: 'React Workshop', date: 'Nov 10, 2025', communityName: 'Next.js Devs', href: '/events/1' },
  { id: 'event-2', name: 'Algorithm Challenge', date: 'Nov 15, 2025', communityName: 'Data Structures Club', href: '/events/2' },
  { id: 'event-3', name: 'Gaming Tournament', date: 'Nov 20, 2025', communityName: 'University Gaming', href: '/events/3' },
];

// --- DATA RELATIONSHIPS ---
// This is how we know *who* joined *what*

const userCommunityMemberships = [
  { userId: 'user-1', communityId: 'comm-1' },
  { userId: 'user-1', communityId: 'comm-2' },
  { userId: 'user-2', communityId: 'comm-3' },
];

const userEventRSVPs = [
  { userId: 'user-1', eventId: 'event-1' },
  { userId: 'user-1', eventId: 'event-3' },
  { userId: 'user-2', eventId: 'event-2' },
];

// --- DATA FETCHING FUNCTION ---
const CURRENT_LOGGED_IN_USER_ID = 'user-1';

export async function getProfileData() {
  // 1. Get the user's details
  const user = allUsers.find(u => u.id === CURRENT_LOGGED_IN_USER_ID);

  if (!user) {
    throw new Error('User not found');
  }

  // 2. Get the user's joined communities
  const communityIds = userCommunityMemberships
    .filter(m => m.userId === user.id)
    .map(m => m.communityId);
  
  const communities = allCommunities.filter(c => communityIds.includes(c.id));

  // 3. Get the user's events
  const eventIds = userEventRSVPs
    .filter(rsvp => rsvp.userId === user.id)
    .map(rsvp => rsvp.eventId);

  const events = allEvents.filter(e => eventIds.includes(e.id));

  // We return everything needed for your tasks
  return {
    user,
    communities,
    events,
  };
}

export async function updateUserInMockDB(id: string, newName: string, newAvatar: string) {
  // Simulate a network delay, like a real database
  await new Promise(res => setTimeout(res, 500));

  const userIndex = allUsers.findIndex(u => u.id === id);
  
  if (userIndex !== -1) {
    console.log(`MOCK DB: Updating user ${id} from "${allUsers[userIndex].name}" to "${newName}"`);
    allUsers[userIndex].name = newName;
    allUsers[userIndex].avatarUrl = newAvatar;
    return allUsers[userIndex];
  }
  
  throw new Error('User not found in mock DB');
}