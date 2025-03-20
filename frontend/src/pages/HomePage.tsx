// src/pages/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchRandomCart } from '../services/api';

const HomePage: React.FC = () => {
  const { setCart, hasCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleGenerateCart = async () => {
    try {
      setLoading(true);
      const randomCart = await fetchRandomCart();
      setCart(randomCart);
      navigate('/checkout');
    } catch (error) {
      console.error('Error generando carrito:', error);
      alert('No se pudo generar el carrito. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Flapp E-Commerce</h1>
        <p className="text-gray-600 mb-8 text-center">
          Simulación de una plataforma de comercio electrónico
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleGenerateCart}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? 'Generando...' : 'Generar carrito'}
          </button>
          
          <button
            onClick={handleCheckout}
            disabled={!hasCart || loading}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              !hasCart || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            Finalizar compra
          </button>
        </div>
        
        {!hasCart && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Genera un carrito aleatorio para continuar
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;