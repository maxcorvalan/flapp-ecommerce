// src/services/shippingService.ts
import axios from 'axios';

// Credenciales para los servicios de envío
const API_KEYS = {
  TRAELO_YA: 'MbUP6JzTNB3kC5rjwFS2neuahLE7yKvZs8HXtmqf',
  UDER: 'NDM6HWuxtyQ9saYqnZgbJBVrS8A7KpeXRjGv2m5c'
};

// Datos de origen fijos de la tienda
const STORE_DATA = {
  name: 'Tienda Flapp',
  phone: '+569 1234 5678',
  address: 'Juan de Valiente 3630',
  commune: 'Vitacura'
};

/**
 * Solicita una cotización al servicio TraeloYa
 */
export const getTarificationFromTraeloYa = async (products: any[], customerData: { shipping_street: any; commune: any; phone: any; name: any; }) => {
  try {
    // Transformar los productos al formato esperado por TraeloYa
    const items = products.map(product => ({
      quantity: product.quantity,
      value: product.price,
      // Asumimos un volumen genérico ya que no tenemos dimensiones reales
      volume: product.quantity * 10 
    }));
    
    // Configurar los puntos de origen y destino
    const waypoints = [
      {
        type: 'PICK_UP',
        addressStreet: STORE_DATA.address,
        city: STORE_DATA.commune,
        phone: STORE_DATA.phone,
        name: STORE_DATA.name
      },
      {
        type: 'DROP_OFF',
        addressStreet: customerData.shipping_street,
        city: customerData.commune,
        phone: customerData.phone,
        name: customerData.name
      }
    ];
    
    // Realizar la solicitud a la API
    const response = await axios.post(
      'https://recruitment.weflapp.com/tarifier/traelo_ya',
      { items, waypoints },
      {
        headers: {
          'X-Api-Key': API_KEYS.TRAELO_YA,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Verificar si hay un error en la respuesta
    if (response.data.error) {
      return { success: false, error: response.data.error };
    }
    
    // Extraer el precio de la cotización
    return { 
      success: true, 
      price: response.data.deliveryOffers.pricing.total 
    };
    
  } catch (error) {
    console.error('Error en tarificación con TraeloYa:', error);
    return { 
      success: false, 
      error: 'No hay tarifas disponibles para el envío solicitado con TraeloYa' 
    };
  }
};

/**
 * Solicita una cotización al servicio Uder
 */
export const getTarificationFromUder = async (products: any[], customerData: { shipping_street: any; commune: any; name: any; phone: any; }) => {
  try {
    // Transformar los productos al formato esperado por Uder
    const manifest_items = products.map(product => ({
      name: `Producto ID: ${product.productId}`,
      quantity: product.quantity,
      price: product.price,
      dimensions: {
        length: 10, // Asumimos dimensiones genéricas
        height: 10,
        depth: 10
      }
    }));
    
    // Preparar los datos para la cotización
    const requestData = {
      pickup_address: `${STORE_DATA.address}, ${STORE_DATA.commune}`,
      pickup_name: STORE_DATA.name,
      pickup_phone_number: STORE_DATA.phone,
      dropoff_address: `${customerData.shipping_street}, ${customerData.commune}`,
      dropoff_name: customerData.name,
      dropoff_phone_number: customerData.phone,
      manifest_items
    };
    
    // Realizar la solicitud a la API
    const response = await axios.post(
      'https://recruitment.weflapp.com/tarifier/uder',
      requestData,
      {
        headers: {
          'X-Api-Key': API_KEYS.UDER,
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Verificar si hay un error en la respuesta
    if (response.data.error) {
      return { success: false, error: response.data.error };
    }
    
    // Extraer el precio de la cotización
    return { 
      success: true, 
      price: response.data.fee 
    };
    
  } catch (error) {
    console.error('Error en tarificación con Uder:', error);
    return { 
      success: false, 
      error: 'No hay tarifas disponibles para el envío solicitado con Uder' 
    };
  }
};