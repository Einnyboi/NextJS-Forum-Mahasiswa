import React from 'react';

interface CardProps
{
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) =>
(
    <div className = {`card-widget ${className}`}>
        <h4 className = "card-title">{title}</h4>
        <div className = "card-content">
            {children}
        </div>
    </div>
);