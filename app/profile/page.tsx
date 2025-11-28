// ... other imports
import ProfileHeader from '@/components/features/profile/ProfileHeader';
import CommunityList from '@/components/features/profile/CommunityList';
import EventList from '@/components/features/profile/EventList';
import ProfilePosts from '@/components/features/profile/ProfilePosts';

// 1. IMPORT THE NEW FORM
import CreatePostForm from '@/components/features/posts/CreatePostForm';

import { getProfileData } from '@/lib/data';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Navbar from '@/components/layout/navbar';
// import Sidebar from '@/components/layout/sidebar';

export default async function ProfilePage() {
  const { user, communities, events } = await getProfileData();

  return (
    <div>

      <Container className="main-container">
      <Row>
        <Col lg={8}>
          <ProfileHeader user={user} />
          
          {/* 2. ADD THE FORM HERE */}
          {/* We pass 'communities' so the dropdown works */}
          <CreatePostForm user={user} communities={communities} />

          <ProfilePosts />
        </Col>

        <Col lg={4}>
          <CommunityList communities={communities} />
          <EventList events={events} />
        </Col>
      </Row>
      </Container>
    </div>
  );
}