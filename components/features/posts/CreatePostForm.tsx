'use client';

import { useState } from 'react';
import { User, Community } from '@/lib/types';
import { Card, Form, Button, Alert } from 'react-bootstrap';

type CreatePostFormProps = {
  user: User;
  communities: Community[];
};

export default function CreatePostForm({ user, communities }: CreatePostFormProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState('');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'danger'; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      // 1. Call our Backend API
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tag: "General", // Hardcoded for now, can be an input later
          communityId: selectedCommunityId,
          authorId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create post');

      // 2. Success!
      setStatus({ type: 'success', msg: 'Post created successfully!' });
      setTitle('');
      setContent('');
      // Ideally, you would refresh the list of posts here

    } catch (error) {
      // 1. Remove ': any' from the catch variable
      // 2. Check if it is actually an Error object
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setStatus({ type: 'danger', msg: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-default mb-4 border-0">
      <Card.Body>
        <h5 className="card-title mb-3">Create a Post</h5>
        
        {status && <Alert variant={status.type}>{status.msg}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Community Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Choose Community</Form.Label>
            <Form.Select 
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              required
            >
              <option value="">Select a community...</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Title Input */}
          <Form.Group className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Post Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          {/* Content Input */}
          <Form.Group className="mb-3">
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="What's on your mind?" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}