import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CustomerData, ShippingQuote, requestShippingQuote } from '../services/api';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import CartTable from '../components/CartTable';
import CustomerForm from '../components/CustomerForm';

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    shipping_street: '',
    commune: '',
    phone: ''
  });
  
  const [quoteResult, setQuoteResult] = useState<ShippingQuote | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Detectar si no hay carrito y redirigir
  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);
  
  // Si no hay carrito (durante el primer render), no renderizar nada
  if (!cart || cart.products.length === 0) {
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleQuoteShipping = async () => {
    try {
      // Validar campos
      const requiredFields: (keyof CustomerData)[] = ['name', 'shipping_street', 'commune', 'phone'];
      for (const field of requiredFields) {
        if (!customerData[field]) {
          setError(`El campo ${field} es obligatorio`);
          return;
        }
      }
      
      setError('');
      setLoading(true);
      
      const result = await requestShippingQuote(cart, customerData);
      setQuoteResult(result);
    } catch (error) {
      console.error('Error al cotizar:', error);
      if (error instanceof Error) {
        setError(error.message || 'No hay envíos disponibles :(');
      } else {
        setError('No hay envíos disponibles :(');
      }
      setQuoteResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearCart = () => {
    clearCart();
    navigate('/');
  };
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-flapp-dark">Resumen de tu compra</h1>
        
        <Card title="Productos en tu carrito">
          <CartTable products={cart.products} />
        </Card>
        
        <Card title="Datos de envío">
          <CustomerForm 
            customerData={customerData} 
            onChange={handleInputChange} 
          />
        </Card>
        
        {quoteResult && (
          <Alert type="success">
            <span className="font-bold">
              Envío Flapp con {quoteResult.courier} ⚡️ - ${quoteResult.price.toFixed(2)}
            </span>
          </Alert>
        )}
        
        {error && <Alert type="error">{error}</Alert>}
        
        <div className="flex flex-wrap gap-4 mt-6">
          <Button 
            variant="primary" 
            onClick={handleQuoteShipping}
            isLoading={loading}
          >
            {loading ? 'Cotizando...' : 'Cotizar despacho'}
          </Button>
          
          <Button 
            variant="danger"
            onClick={handleClearCart}
            disabled={loading}
          >
            Limpiar carrito
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleGoBack}
            disabled={loading}
          >
            Volver
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;