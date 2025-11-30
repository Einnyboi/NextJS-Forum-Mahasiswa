'use client';

import { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

type CreateCommunityFormProps = {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
};

export default function CreateCommunityForm({ show, onHide, onSuccess }: CreateCommunityFormProps) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Auto-generate handle from name
    const autoHandle = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30);
    setHandle(autoHandle);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !handle.trim() || !imageUrl.trim()) {
      setError('Name, handle, and image URL are required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, handle, description, imageUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create community');
        return;
      }

      setSuccess('Community created successfully!');
      setTimeout(() => {
        onSuccess();
        onHide();
        // Reset form
        setName('');
        setHandle('');
        setDescription('');
        setImageUrl('');
        setSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error creating community:', error);
      setError('Failed to create community');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Community Name *</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Computer Science Students"
              value={name}
              onChange={handleNameChange}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Handle * <small className="text-muted">(unique identifier)</small></Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., computer-science-students"
              value={handle}
              onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              disabled={isLoading}
            />
            <Form.Text className="text-muted">
              This will be your community's unique URL: /community/{handle || 'your-handle'}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="What's this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL *</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isLoading}
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onHide} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}