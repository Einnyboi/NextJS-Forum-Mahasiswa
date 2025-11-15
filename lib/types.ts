// This is a common type you'll need everywhere
export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  joinDate: string;
  joinedCommunityIds? : string[];
  rsvpEventIds? : string[];
};

// You need this for your community list
export type Community = {
  id: string;
  name: string;
  imageUrl: string;
};

// You need this for your new event list
export type Event = {
  id: string;
  name: string;
  date: string;
  communityName: string; // To show where the event is
  href: string;
};

// Your friend would use this, but we'll define it for completeness
export type Post = {
  id: string;
  title: string;
  date: string;
  category: string;
  href: string;
  authorId: string; // We'd use this to filter
};