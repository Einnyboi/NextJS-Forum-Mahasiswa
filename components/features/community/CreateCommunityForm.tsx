'use client';

import { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { api } from '@/lib/api';

type CreateCommunityFormProps = {
  onSuccess: () => void; // Callback to refresh the list after creating
};

export default function CreateCommunityForm({ onSuccess }: CreateCommunityFormProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use a default placeholder if they don't provide an image
      const finalImage = image || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

      await api.communities.create({
        name,
        description: desc,
        imageUrl: finalImage
      });

      // Reset form
      setName('');
      setDesc('');
      setImage('');
      onSuccess(); // Refresh parent list
      alert("Community Created!");

    } catch (err: any) {
      setError(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-default border-0 mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">Create New Community</h5>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Community Name</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="e.g. React Lovers" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2} 
              placeholder="What is this group about?" 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL (Optional)</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="https://..." 
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? 'Creating...' : 'Create Community'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}