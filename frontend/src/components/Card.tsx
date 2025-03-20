import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-card p-6 mb-6 transition-shadow hover:shadow-card-hover ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-flapp-dark border-b border-flapp-lightGray pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;