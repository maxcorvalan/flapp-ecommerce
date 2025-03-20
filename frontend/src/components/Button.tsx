import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  className = '',
  ...rest
}) => {
  const baseClasses = "py-3 px-6 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-flapp-blue text-flapp-dark hover:bg-blue-400 focus:ring-blue-500",
    secondary: "bg-flapp-dark text-white hover:bg-gray-800 focus:ring-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  
  const disabledClasses = "opacity-60 cursor-not-allowed";
  const loadingClasses = "relative !text-transparent";
  const widthClasses = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${disabled || isLoading ? disabledClasses : ""}
        ${isLoading ? loadingClasses : ""}
        ${widthClasses}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...rest}
    >
      {children}
      
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin h-5 w-5 text-current" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button;