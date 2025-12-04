// lib/types.ts
// the schemas for our "tables"

export type User = {
  role: string;
  password: string;
  fullName: string;
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string;
  // Arrays of IDs for fast lookups (NoSQL style)
  joinedCommunityIds?: string[];
  rsvpEventIds?: string[];
};

export type Community = {
  id: string;
  name: string; // Display name (can have duplicates)
  handle: string; // Unique identifier like @community-handle
  imageUrl: string; // Profile image
  bannerUrl?: string; // Banner image (optional)
  description?: string; // Optional: Good for the header
  memberCount?: number; // Optional: Good for sorting popularity
  upvotes?: number; // NEW: Total upvotes
  downvotes?: number; // NEW: Total downvotes
  votedBy?: { [userId: string]: 'up' | 'down' }; // NEW: Track who voted and how
};

export type Event = {
  id: string;
  name: string;
  date: string; // Keeping as string for frontend simplicity
  communityName: string;
  communityId?: string; // Added for linking back to the community
  href: string;
};

export type Post = {
  id: string; // primary key

  //foreign keys
  communityId: string;
  authorId: string;

  title: string;
  description: string;
  category: string;
  author?: string; // Hanya ada untuk Post dan User
  imageUrl?: string;
};