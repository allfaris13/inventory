import React from 'react';
import './card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'yellow';
}

export function Card({ children, title, className = '', glowColor = 'blue' }: CardProps) {
  return (
    <div className={`cyber-card glass-panel glow-${glowColor} ${className}`}>
      {title && (
        <div className="card-header-styled">
          <h3 className="card-title">{title}</h3>
          <div className={`card-line bg-${glowColor}`}></div>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}
