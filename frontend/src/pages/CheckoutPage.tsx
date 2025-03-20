import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CustomerData, ShippingQuote, requestShippingQuote } from '../services/api';

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
  
  // Si no hay carrito, redirigir a la página principal
  if (!cart || cart.products.length === 0) {
    navigate('/');
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
  
  // Calcular el total del carrito
  const cartTotal = cart.products.reduce((total, product) => {
    return total + (product.price * product.quantity - product.discount);
  }, 0);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Resumen de tu compra</h1>
      
      {/* Productos del carrito */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Productos en tu carrito</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Unitario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cart.products.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.productId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${product.discount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${((product.price * product.quantity) - product.discount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="px-6 py-4 text-right font-bold">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold">
                  ${cartTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      {/* Formulario de datos de envío */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Datos de envío</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              value={customerData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: Juan Pérez"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              value={customerData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: +56912345678"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="shipping_street"
              value={customerData.shipping_street}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: Calle Falsa 123"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna
            </label>
            <input
              type="text"
              name="commune"
              value={customerData.commune}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ej: Vitacura"
            />
          </div>
        </div>
      </div>
      
      {/* Resultado de cotización */}
      {quoteResult && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-8">
          <strong className="font-bold">Envío Flapp con {quoteResult.courier} ⚡️ - ${quoteResult.price.toFixed(2)}</strong>
        </div>
      )}
      
      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
          <strong className="font-bold">{error}</strong>
        </div>
      )}
      
      {/* Botones de acción */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleQuoteShipping}
          disabled={loading}
          className={`py-2 px-4 rounded-md font-medium ${
            loading
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Cotizando...' : 'Cotizar despacho'}
        </button>
        
        <button
          onClick={handleClearCart}
          disabled={loading}
          className="py-2 px-4 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          Limpiar carrito
        </button>
        
        <button
          onClick={handleGoBack}
          disabled={loading}
          className="py-2 px-4 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;