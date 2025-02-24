// Reusable card component for both tasks and notes
import React from 'react';
import './Card.scss';

export function Card({ children, className, hoverable = true }) {
  return (
    <div className={`card ${hoverable ? 'card--hoverable' : ''} ${className || ''}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="card__header">{children}</div>;
}

export function CardContent({ children }) {
  return <div className="card__content">{children}</div>;
}

export function CardFooter({ children }) {
  return <div className="card__footer">{children}</div>;
} 