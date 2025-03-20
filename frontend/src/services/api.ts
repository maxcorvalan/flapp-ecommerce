import axios from 'axios';
import { Cart, Product } from '../context/CartContext';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const DUMMY_JSON_URL = 'https://dummyjson.com';

// Interfaz para los datos del cliente
export interface CustomerData {
  name: string;
  shipping_street: string;
  commune: string;
  phone: string;
}

// Interfaz para la respuesta de cotización
export interface ShippingQuote {
  courier: string;
  price: number;
}

/**
 * Obtiene un carrito aleatorio desde la API de DummyJSON
 */
export const fetchRandomCart = async (): Promise<Cart> => {
  try {
    // Obtener productos aleatorios
    const response = await axios.get(`${DUMMY_JSON_URL}/carts/1`);
    const { products } = response.data;
    
    // Transformar al formato de nuestro carrito
    const cartProducts: Product[] = products.map((p: any) => ({
      productId: p.id.toString(),
      price: p.price,
      quantity: p.quantity,
      discount: Math.floor(p.price * p.quantity * 0.1) // 10% de descuento
    }));
    
    return { products: cartProducts };
  } catch (error) {
    console.error('Error obteniendo carrito aleatorio:', error);
    throw new Error('No se pudo generar un carrito aleatorio');
  }
};

/**
 * Solicita una cotización de envío al backend
 */
export const requestShippingQuote = async (
  cart: Cart,
  customerData: CustomerData
): Promise<ShippingQuote> => {
  try {
    const response = await axios.post(`${API_URL}/cart`, {
      products: cart.products,
      customer_data: customerData
    });
    
    return response.data;
  } catch (error) {
    console.error('Error solicitando cotización:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Error al solicitar cotización');
    }
    throw new Error('Error de conexión al solicitar cotización');
  }
};