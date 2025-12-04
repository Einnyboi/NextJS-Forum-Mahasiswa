"use client";

import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Link from 'next/link';
import { Post } from '@/lib/types';

type ProfilePostsProps = {
  posts?: Post[];
};

export default function ProfilePosts({ posts = [] }: ProfilePostsProps) {
  return (
    <Card className="card-default mb-4 border-0">
      <Card.Body>
        <h4 className="card-title mb-3">My Posts</h4>
        {posts.length === 0 ? (
          <p className="text-muted">You haven't posted yet.</p>
        ) : (
          <ListGroup variant="flush">
            {posts.map(p => (
              <ListGroup.Item key={p.id} className="border-0 px-0 bg-transparent mb-2">
                <Link href={`/posts/${p.id}`} className="text-decoration-none">
                  <div className="fw-bold">{p.title}</div>
                  <div className="text-muted small">{p.communityName} · {new Date(p.createdAt).toLocaleString()}</div>
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}
