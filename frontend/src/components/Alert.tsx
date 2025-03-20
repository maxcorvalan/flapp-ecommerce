import React, { ReactNode } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  children: ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, children, className = '' }) => {
  const typeClasses = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    info: 'bg-blue-50 border-flapp-blue text-flapp-dark',
  };
  
  const iconMap = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 7a1 1 0 011-1h.01a1 1 0 110 2H11a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };
  
  return (
    <div className={`border px-4 py-3 rounded-md relative mb-6 flex items-start gap-3 ${typeClasses[type]} ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{iconMap[type]}</div>
      <div className="flex-grow font-medium">{children}</div>
    </div>
  );
};

export default Alert;