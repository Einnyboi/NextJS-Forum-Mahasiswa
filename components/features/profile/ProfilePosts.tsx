"use client";

import React from 'react';
import Card from 'react-bootstrap/Card';

export default function ProfilePosts() {
  return (
    <Card className="card-default mb-4 border-0">
      <Card.Body>
        <h4 className="card-title mb-3">My Posts</h4>
        <p className="text-muted">(Post history component will go here)</p>
      </Card.Body>
    </Card>
  );
}
