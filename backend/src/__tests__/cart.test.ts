// backend/src/__tests__/cart.test.ts
import request from 'supertest';
import express from 'express';
import { processCart } from '../controllers/cartController';
import * as productService from '../services/productService';
import * as shippingService from '../services/shippingService';

// Mock de los servicios externos
jest.mock('../services/productService');
jest.mock('../services/shippingService');

// Configuración del servidor Express para pruebas
const app = express();
app.use(express.json());
app.post('/api/cart', async (req, res, next) => {
  try {
    await processCart(req, res);
  } catch (error) {
    next(error);
  }
});
describe('POST /api/cart endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Datos de prueba
  const validCartData = {
    products: [
      { productId: '1', price: 50, quantity: 2, discount: 10 }
    ],
    customer_data: {
      name: 'Test User',
      shipping_street: 'Test Street 123',
      commune: 'Test Commune',
      phone: '+56912345678'
    }
  };

  test('debería devolver 400 si el carrito está vacío', async () => {
    const response = await request(app)
      .post('/api/cart')
      .send({
        products: [],
        customer_data: validCartData.customer_data
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('al menos un producto');
  });

  test('debería devolver 400 si faltan los datos del cliente', async () => {
    const response = await request(app)
      .post('/api/cart')
      .send({
        products: validCartData.products,
        customer_data: null
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('datos del cliente');
  });

  test('debería devolver 400 si un producto no existe', async () => {
    // Mock para devolver productos sin incluir el solicitado
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '2', title: 'Product 2', stock: 10, rating: 4.5 }
    ]);

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('no existe en el catálogo');
  });

  test('debería devolver 400 si no hay suficiente stock', async () => {
    // Mock para devolver un producto con stock insuficiente
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Product 1', stock: 5, rating: 5 } // Stock real = 1
    ]);

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData); // Cantidad solicitada = 2

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Stock insuficiente');
  });

  test('debería devolver 400 si no hay tarifas disponibles', async () => {
    // Mock para devolver un producto con stock suficiente
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Product 1', stock: 50, rating: 5 } // Stock real = 10
    ]);

    // Mock para simular que ambos servicios de envío fallan
    (shippingService.getTarificationFromTraeloYa as jest.Mock).mockResolvedValue({
      success: false,
      error: 'No hay tarifas disponibles'
    });
    (shippingService.getTarificationFromUder as jest.Mock).mockResolvedValue({
      success: false,
      error: 'No hay tarifas disponibles'
    });

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('No hay tarifas disponibles');
  });

  test('debería devolver la tarifa más barata entre TraeloYa y Uder', async () => {
    // Mock para devolver un producto con stock suficiente
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Product 1', stock: 50, rating: 5 } // Stock real = 10
    ]);

    // Mock para simular las respuestas de los servicios de envío
    (shippingService.getTarificationFromTraeloYa as jest.Mock).mockResolvedValue({
      success: true,
      price: 5990.00
    });
    (shippingService.getTarificationFromUder as jest.Mock).mockResolvedValue({
      success: true,
      price: 6500.00
    });

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      courier: 'TraeloYa',
      price: 5990.00
    });
  });

  test('debería elegir Uder si ofrece tarifa más barata', async () => {
    // Mock para devolver un producto con stock suficiente
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Product 1', stock: 50, rating: 5 }
    ]);

    // Mock para simular las respuestas de los servicios de envío
    (shippingService.getTarificationFromTraeloYa as jest.Mock).mockResolvedValue({
      success: true,
      price: 7500.00
    });
    (shippingService.getTarificationFromUder as jest.Mock).mockResolvedValue({
      success: true,
      price: 6500.00
    });

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      courier: 'Uder',
      price: 6500.00
    });
  });

  test('debería elegir TraeloYa si Uder no está disponible', async () => {
    // Mock para devolver un producto con stock suficiente
    (productService.getProductsFromAPI as jest.Mock).mockResolvedValue([
      { id: '1', title: 'Product 1', stock: 50, rating: 5 }
    ]);

    // Mock para simular que sólo TraeloYa está disponible
    (shippingService.getTarificationFromTraeloYa as jest.Mock).mockResolvedValue({
      success: true,
      price: 5990.00
    });
    (shippingService.getTarificationFromUder as jest.Mock).mockResolvedValue({
      success: false,
      error: 'No hay tarifas disponibles'
    });

    const response = await request(app)
      .post('/api/cart')
      .send(validCartData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      courier: 'TraeloYa',
      price: 5990.00
    });
  });
});