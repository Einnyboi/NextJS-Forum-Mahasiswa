import ProfileHeader from '@/components/features/profile/ProfileHeader';
import CommunityList from '@/components/features/profile/CommunityList';
import EventList from '@/components/features/profile/EventList';
import ProfilePosts from '@/components/features/profile/ProfilePosts';
import { getProfileData } from '@/lib/data';

// Keep this file a server component (async) — move client-only UI (react-bootstrap) into client components
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default async function ProfilePage() {
  const { user, communities, events } = await getProfileData();

  return (
    <Container className="main-container">
      <Row>
        {/* --- KOLOM KIRI (Main Content) --- */}
        <Col lg={8}>
          <ProfileHeader user={user} />
          
          <ProfilePosts />
        </Col>

        {/* --- KOLOM KANAN (Sidebar) --- */}
        <Col lg={4}>
          <CommunityList communities={communities} />
          <EventList events={events} />
        </Col>
      </Row>
    </Container>
  );
}