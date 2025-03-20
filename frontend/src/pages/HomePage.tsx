import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchRandomCart } from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';

const HomePage: React.FC = () => {
  const { setCart, hasCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const randomCart = await fetchRandomCart();
      setCart(randomCart);
      navigate('/checkout');
    } catch (err) {
      console.error('Error generando carrito:', err);
      setError('No se pudo generar el carrito. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-lg">
          <Card>
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-flapp-blue rounded-full flex items-center justify-center mb-4">
                <span className="text-flapp-dark text-3xl font-bold">F</span>
              </div>
              <h1 className="text-3xl font-bold text-flapp-dark mb-2">Flapp E-Commerce</h1>
              <p className="text-flapp-gray">
                Simulación de una plataforma de comercio electrónico para comprar y enviar productos
              </p>
            </div>
            
            {error && <Alert type="error">{error}</Alert>}
            
            <div className="space-y-4">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleGenerateCart}
                isLoading={loading}
              >
                {loading ? 'Generando...' : 'Generar carrito aleatorio'}
              </Button>
              
              <Button
                variant="secondary"
                fullWidth
                onClick={handleCheckout}
                disabled={!hasCart || loading}
              >
                Finalizar compra
              </Button>
            </div>
            
            {!hasCart && (
              <p className="mt-4 text-sm text-flapp-gray text-center">
                Genera un carrito aleatorio para continuar con la compra
              </p>
            )}
          </Card>
          
          <div className="mt-8 text-center text-sm text-flapp-gray">
            <p>Proyecto de simulación e-commerce utilizando React, TypeScript y TailwindCSS</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;