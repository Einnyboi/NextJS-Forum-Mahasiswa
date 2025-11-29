import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const user = await dbService.users.getById(id);
    if (!user) return NextResponse.json({ error: 'user not found' }, { status: 404 });

    // communities: load all and filter by user's joinedCommunityIds
    const allCommunities = await dbService.communities.getAll();
    const communities = (user.joinedCommunityIds && user.joinedCommunityIds.length > 0)
      ? allCommunities.filter(c => user.joinedCommunityIds?.includes(c.id))
      : [];

    // events: fetch upcoming events and filter by user's rsvpEventIds
    const upcoming = await dbService.events.getUpcoming();
    const events = (user.rsvpEventIds && user.rsvpEventIds.length > 0)
      ? upcoming.filter(e => user.rsvpEventIds?.includes(e.id))
      : [];

    // posts by author
    const posts = await dbService.posts.getByAuthor(user.id);

    return NextResponse.json({ user, communities, events, posts });
  } catch (err) {
    console.error('profile api error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    await dbService.users.update(id, data);
    return NextResponse.json({ message: 'updated' });
  } catch (err) {
    console.error('profile POST error', err);
    return NextResponse.json({ error: 'internal' }, { status: 500 });
  }
}