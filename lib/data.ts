// lib/data.ts
// Lightweight server-side data helpers used across pages (getProfileData etc.)

import { dbService } from './db';

export async function getProfileData() {
  // Fetch current user profile, communities and upcoming events
  // Note: dbService.users.getProfile currently returns a placeholder userId; replace
  // with real auth integration when available.
  const user = await dbService.users.getProfile();
  const communities = await dbService.communities.getAll();
  const events = await dbService.events.getUpcoming();

  return { user, communities, events };
}

export async function getHomeData() {
  const communities = await dbService.communities.getAll();
  const events = await dbService.events.getUpcoming();
  const posts = await dbService.posts.getAll();
  return { communities, events, posts };
}

export async function getPostById(id: string) {
  return dbService.posts.getById(id);
}

export default { getProfileData, getHomeData, getPostById };
