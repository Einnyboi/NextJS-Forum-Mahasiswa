'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProfileHeader from './ProfileHeader';
import CommunityList from './CommunityList';
import EventList from './EventList';
import ProfilePosts from './ProfilePosts';
import CreatePostForm from '@/components/features/posts/CreatePostForm';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { User, Community, Event, Post } from '@/lib/types';

export default function ProfileClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // read logged-in user from localStorage
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('userSession') : null;
      if (!raw) {
        // redirect to login if no user
        router.push('/login');
        return;
      }
      const parsed = JSON.parse(raw);
      const userId = parsed?.id || parsed?.uid || parsed?.userId;
      if (!userId) {
        setError('Invalid user data in storage.');
        setLoading(false);
        return;
      }

      // fetch profile data from server
      fetch(`/api/profile?id=${encodeURIComponent(userId)}`)
        .then(res => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setUser(data.user ?? null);
            setCommunities(data.communities ?? []);
            setEvents(data.events ?? []);
            setPosts(data.posts ?? []);
          }
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false));
    } catch (e) {
      setError('Failed to read local user');
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="p-4">Loading profile…</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!user) return <div className="p-4">No user data available.</div>;

  return (
    <Row>
      <Col lg={8}>
        <ProfileHeader user={user} />
        <CreatePostForm user={user} communities={communities} />
        <ProfilePosts posts={posts} />
      </Col>

      <Col lg={4}>
        <CommunityList communities={communities} />
        <EventList events={events} />
      </Col>
    </Row>
  );
}
