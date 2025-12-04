import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CommunityData } from '@/lib/api';

interface CommunityHeroCarouselProps {
    communities: CommunityData[];
}

export const CommunityHeroCarousel = ({ communities }: CommunityHeroCarouselProps) => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!communities || communities.length === 0) return null;

    const currentCommunity = communities[currentIndex];

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % communities.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + communities.length) % communities.length);
    };

    return (
        <div className="mb-4">
            {/* Header with Trending Community and Explore All */}
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="m-0 text-dark" style={{ fontWeight: 600, letterSpacing: '0.5px' }}>Trending Community</h4>
                <button
                    className="btn btn-danger rounded-pill px-4 fw-bold text-white"
                    onClick={() => router.push('/community')}
                    style={{ backgroundColor: '#c20114', borderColor: '#c20114' }}
                >
                    Explore All
                </button>
            </div>

            {/* Carousel Card */}
            <div
                className="position-relative rounded-4 overflow-hidden shadow-sm text-white"
                style={{
                    height: '300px',
                    cursor: 'pointer',
                    backgroundImage: `url(${currentCommunity.imageUrl || 'https://via.placeholder.com/800x400'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                onClick={() => router.push(`/community/${currentCommunity.id}`)}
            >
                {/* Dark Overlay */}
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}></div>

                {/* Content */}
                <div className="position-relative h-100 d-flex align-items-center justify-content-between px-3 px-md-5">

                    {/* Left Arrow */}
                    <button
                        className="btn rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            zIndex: 10,
                            backgroundColor: '#c20114', // Red
                            border: '1px solid #c20114',
                            color: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                        onClick={handlePrev}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Center Info */}
                    <div className="d-flex align-items-center gap-4 flex-grow-1 justify-content-start text-center text-md-start flex-column flex-md-row mx-4 ps-md-5">
                        {/* Avatar */}
                        <div
                            className="rounded-circle bg-white overflow-hidden flex-shrink-0 border border-4 border-white shadow-sm"
                            style={{ width: '120px', height: '120px' }}
                        >
                            <img
                                src={currentCommunity.imageUrl || 'https://via.placeholder.com/150'}
                                alt={currentCommunity.name}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>

                        {/* Text */}
                        <div style={{ maxWidth: '600px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                            <h2 className="fw-bold mb-2 display-6">{currentCommunity.name}</h2>
                            <p className="mb-2 opacity-90 fs-5">
                                {(currentCommunity.description || '').length > 100
                                    ? (currentCommunity.description || '').substring(0, 100) + '...'
                                    : (currentCommunity.description || 'No description available.')}
                            </p>
                            <div className="d-flex gap-3 justify-content-center justify-content-md-start opacity-75 small fw-bold">
                                <span>{currentCommunity.members?.length || 0} Members</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                        className="btn rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{
                            width: '40px',
                            height: '40px',
                            zIndex: 10,
                            backgroundColor: '#c20114', // Red
                            border: '1px solid #c20114',
                            color: 'white',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}
                        onClick={handleNext}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
