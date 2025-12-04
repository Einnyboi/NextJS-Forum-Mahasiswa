'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostData, api } from '@/lib/api';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';

// Helper: Warna avatar acak berdasarkan huruf depan
function getAvatarColor(letter: string) {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#009688', '#FF5722', '#795548', '#607D8B'];
    const index = letter ? letter.charCodeAt(0) % colors.length : 0;
    return colors[index];
}

// Helper: Format Date
const formatDate = (date: any) => {
    if (!date) return 'Just now';
    try {
        if (typeof date === 'object' && date.seconds) {
            // Firestore Timestamp
            return new Date(date.seconds * 1000).toLocaleDateString('id-ID');
        }
        if (date instanceof Date) {
            return date.toLocaleDateString('id-ID');
        }
        if (typeof date === 'string') {
            return date;
        }
    } catch (e) {
        return 'Just now';
    }
    return 'Just now';
};

interface ThreadCardProps {
    thread: PostData;
    clickable?: boolean;
    hideCommentAction?: boolean;
    commentCount?: number; // NEW
}

export const ThreadCard = ({ thread, clickable = true, hideCommentAction = false, commentCount }: ThreadCardProps) => {
    const router = useRouter();

    // State Lokal untuk interaksi visual
    const [upvotes, setUpvotes] = useState(thread.upvotes || 0);
    const [downvotes, setDownvotes] = useState(thread.downvotes || 0);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    // Prioritize passed commentCount, then thread.commentCount, then 0
    const [localCommentCount, setLocalCommentCount] = useState(commentCount ?? thread.commentCount ?? 0);

    // Get current user & fetch comment count if missing
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            if (session.isLoggedIn) {
                setUserEmail(session.email);
                // Check if user has voted
                if (thread.votedBy && thread.votedBy[session.email]) {
                    setUserVote(thread.votedBy[session.email]);
                }
            }
        }

        // Fetch comment count if it looks like it might be missing AND we didn't get a prop
        const fetchCommentCount = async () => {
            if (commentCount === undefined && thread.commentCount === undefined) {
                try {
                    const comments = await api.comments.getByPost(thread.id);
                    setLocalCommentCount(comments.length);
                } catch (e) {
                    console.error("Failed to fetch comment count", e);
                }
            }
        };
        fetchCommentCount();

    }, [thread, commentCount]);

    // Update local count if prop changes
    useEffect(() => {
        if (commentCount !== undefined) {
            setLocalCommentCount(commentCount);
        } else if (thread.commentCount !== undefined) {
            setLocalCommentCount(thread.commentCount);
        }
    }, [thread.commentCount, commentCount]);

    // Ambil inisial nama untuk avatar
    const initial = thread.author ? thread.author.charAt(0).toUpperCase() : '?';
    const voteScore = upvotes - downvotes;

    // Determine Display Date
    const displayDate = thread.category === 'event'
        ? (thread.createdAt ? formatDate(thread.createdAt) : (thread.date || 'Just now'))
        : (thread.date || 'Just now');

    const handleCardClick = (e: React.MouseEvent) => {
        if (clickable) {
            router.push(`/thread/${thread.id}`);
        }
    };

    // 2. Fungsi Vote
    const handleUpvote = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userEmail) {
            alert('Please login to vote');
            return;
        }

        try {
            const success = await api.posts.upvote(thread.id, userEmail);
            if (success) {
                if (userVote === 'up') {
                    setUpvotes(upvotes - 1);
                    setUserVote(null);
                } else if (userVote === 'down') {
                    setDownvotes(downvotes - 1);
                    setUpvotes(upvotes + 1);
                    setUserVote('up');
                } else {
                    setUpvotes(upvotes + 1);
                    setUserVote('up');
                }
            }
        } catch (error) {
            console.error('Upvote failed:', error);
        }
    };

    const handleDownvote = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userEmail) {
            alert('Please login to vote');
            return;
        }

        try {
            const success = await api.posts.downvote(thread.id, userEmail);
            if (success) {
                if (userVote === 'down') {
                    setDownvotes(downvotes - 1);
                    setUserVote(null);
                } else if (userVote === 'up') {
                    setUpvotes(upvotes - 1);
                    setDownvotes(downvotes + 1);
                    setUserVote('down');
                } else {
                    setDownvotes(downvotes + 1);
                    setUserVote('down');
                }
            }
        } catch (error) {
            console.error('Downvote failed:', error);
        }
    };

    return (
        <div
            className="thread-card d-flex flex-column"
            onClick={handleCardClick}
            style={{
                cursor: clickable ? 'pointer' : 'default',
                transition: 'background-color 0.2s',
                padding: '16px' // Standard padding
            }}
        >
            {/* --- CONTENT --- */}
            <div className="flex-grow-1 mb-3">
                {/* Header */}
                <div className="thread-header mb-2">
                    <div className="author-info">
                        <div
                            className="author-avatar"
                            style={{ backgroundColor: getAvatarColor(initial), width: '24px', height: '24px', fontSize: '0.8rem' }}
                        >
                            {initial}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="author-name small fw-bold">{thread.author}</span>
                            <span className="text-muted small">•</span>
                            <span className="post-date small text-muted">{displayDate}</span>
                        </div>
                    </div>

                    <span className={`category-badge ${thread.category} ms-auto`} style={{ fontSize: '0.7rem' }}>
                        {thread.category}
                    </span>
                </div>

                {/* Body */}
                <div className="thread-body mb-3">
                    <h3 className="thread-title h5 fw-bold mb-2">{thread.title}</h3>

                    <p className="thread-content text-muted mb-3">
                        {clickable && (thread.content || "").length > 200
                            ? `${(thread.content || "").substring(0, 200)}...`
                            : (thread.content || "")
                        }
                    </p>

                    {/* Image Display */}
                    {thread.imageUrl && (
                        <div className="mb-3">
                            <img
                                src={thread.imageUrl}
                                alt="Post content"
                                className="img-fluid rounded"
                                style={{ maxHeight: '400px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* --- FOOTER ACTIONS (VOTING & COMMENTS) --- */}
            <div className="thread-footer d-flex gap-4 text-muted small fw-bold align-items-center">

                {/* Voting Section (Moved to Footer) */}
                <div className="d-flex align-items-center gap-1 bg-light rounded-pill px-2 py-1 border">
                    <button
                        onClick={handleUpvote}
                        className={`btn btn-sm p-0 ${userVote === 'up' ? 'text-success' : 'text-muted'}`}
                        style={{ border: 'none', background: 'none', lineHeight: 1 }}
                    >
                        <ThumbsUp size={18} fill={userVote === 'up' ? "currentColor" : "none"} />
                    </button>
                    <span className="mx-1" style={{ minWidth: '15px', textAlign: 'center' }}>{voteScore}</span>
                    <button
                        onClick={handleDownvote}
                        className={`btn btn-sm p-0 ${userVote === 'down' ? 'text-danger' : 'text-muted'}`}
                        style={{ border: 'none', background: 'none', lineHeight: 1 }}
                    >
                        <ThumbsDown size={18} fill={userVote === 'down' ? "currentColor" : "none"} />
                    </button>
                </div>

                {/* Comments */}
                <div className="d-flex align-items-center gap-2">
                    <MessageSquare size={18} />
                    <span>{localCommentCount > 0 ? `${localCommentCount} Comments` : 'Comments'}</span>
                </div>

                {/* Share */}
                <div className="d-flex align-items-center gap-2">
                    <Share2 size={18} />
                    <span>Share</span>
                </div>

                {/* Event Date (Only for Events) */}
                {thread.category === 'event' && thread.date && (
                    <div className="ms-auto d-flex align-items-center gap-2 text-danger small fw-bold">
                        <span>Event Date: {thread.date}</span>
                    </div>
                )}
            </div>
        </div>
    );
};