import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const { hasCart } = useCart();
  
  return (
    <header className="bg-flapp-dark shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-flapp-blue rounded-full flex items-center justify-center">
              <span className="text-flapp-dark text-xl font-bold">F</span>
            </div>
            <span className="text-white text-xl font-bold">Flapp</span>
          </Link>
          
          {hasCart && (
            <Link 
              to="/checkout" 
              className="flex items-center space-x-2 text-white hover:text-flapp-blue transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <span>Mi carrito</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;