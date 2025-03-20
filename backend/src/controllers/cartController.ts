import { Request, Response } from 'express';
import { getProductsFromAPI } from '../services/productService';
import { getTarificationFromTraeloYa, getTarificationFromUder } from '../services/shippingService';

// La firma correcta para un controlador de Express
export const processCart = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { products, customer_data } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'El carrito debe contener al menos un producto' });
    }
    
    if (!customer_data) {
      return res.status(400).json({ error: 'Deben proporcionarse los datos del cliente' });
    }
    
    // 1. Obtener todos los productos existentes de la API
    console.log('Obteniendo productos de la API...');
    const allProducts = await getProductsFromAPI();
    
    // 2. Procesar cada producto del carrito
    const cartDetails = [];
    for (const cartProduct of products) {
      // Buscar el producto en la lista completa
      const apiProduct = allProducts.find(p => p.id.toString() === cartProduct.productId.toString());
      
      if (!apiProduct) {
        return res.status(400).json({ 
          error: `El producto con ID ${cartProduct.productId} no existe en el catálogo` 
        });
      }
      
      // 3. Calcular stock real
      const stockReal = Math.floor(apiProduct.stock / apiProduct.rating);
      
      // 4. Preparar detalles para imprimir en consola
      const productDetail = {
        id: cartProduct.productId,
        nombre: apiProduct.title,
        precio_unitario: cartProduct.price,
        descuento_total: cartProduct.discount,
        cantidad_solicitada: cartProduct.quantity,
        stock_obtenido: apiProduct.stock,
        rating: apiProduct.rating,
        stock_real: stockReal
      };
      
      cartDetails.push(productDetail);
      
      // 5. Verificar stock suficiente
      if (stockReal < cartProduct.quantity) {
        console.log('Stock insuficiente para:', productDetail);
        return res.status(400).json({ 
          error: `Stock insuficiente para el producto "${apiProduct.title}". Stock real: ${stockReal}, Solicitado: ${cartProduct.quantity}` 
        });
      }
    }
    
    // Imprimir detalles del carrito en consola
    console.log('CARRITO RECIBIDO:');
    console.table(cartDetails);
    
    // 6. Realizar cotizaciones con los couriers
    console.log('Solicitando tarificación a TraeloYa...');
    const traeloYaQuote = await getTarificationFromTraeloYa(products, customer_data);
    console.log('Respuesta de TraeloYa:', traeloYaQuote);
    
    console.log('Solicitando tarificación a Uder...');
    const uderQuote = await getTarificationFromUder(products, customer_data);
    console.log('Respuesta de Uder:', uderQuote);
    
    // 7. Verificar si hay tarifas disponibles
    if (!traeloYaQuote.success && !uderQuote.success) {
      return res.status(400).json({ 
        error: 'No hay tarifas disponibles para el envío solicitado' 
      });
    }
    
    // 8. Obtener la mejor tarifa
    let bestCourier = '';
    let bestPrice = 0;
    
    if (traeloYaQuote.success && (!uderQuote.success || traeloYaQuote.price <= uderQuote.price)) {
      bestCourier = 'TraeloYa';
      bestPrice = traeloYaQuote.price;
    } else {
      bestCourier = 'Uder';
      bestPrice = uderQuote.price;
    }
    
    // 9. Retornar la tarifa más barata
    return res.status(200).json({
      courier: bestCourier,
      price: bestPrice
    });
    
  } catch (error) {
    console.error('Error procesando el carrito:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor al procesar el carrito' 
    });
  }
};