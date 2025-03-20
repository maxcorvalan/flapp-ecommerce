import axios from 'axios';

/**
 * Obtiene todos los productos de la API de DummyJSON utilizando paginación
 */
export const getProductsFromAPI = async () => {
  try {
    let allProducts: any[] = [];
    let skip = 0;
    const limit = 10;
    let hasMore = true;
    
    // Bucle para obtener todos los productos con paginación
    while (hasMore) {
      const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      const { products, total } = response.data;
      
      if (products.length === 0) {
        hasMore = false;
      } else {
        allProducts = [...allProducts, ...products];
        skip += limit;
        
        // Verificar si hemos obtenido todos los productos
        if (skip >= total) {
          hasMore = false;
        }
      }
    }
    
    return allProducts;
  } catch (error) {
    console.error('Error obteniendo productos de DummyJSON:', error);
    throw new Error('Error al obtener productos del catálogo');
  }
};