import React from 'react';
import { Product } from '../context/CartContext';

interface CartTableProps {
  products: Product[];
}

const CartTable: React.FC<CartTableProps> = ({ products }) => {
  // Calcular el total del carrito
  const cartTotal = products.reduce((total, product) => {
    return total + (product.price * product.quantity - product.discount);
  }, 0);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-flapp-lightGray">
        <thead className="bg-flapp-lightBg">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-flapp-gray uppercase tracking-wider">
              ID Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-flapp-gray uppercase tracking-wider">
              Precio Unitario
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-flapp-gray uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-flapp-gray uppercase tracking-wider">
              Descuento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-flapp-gray uppercase tracking-wider">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-flapp-lightGray">
          {products.map((product) => (
            <tr key={product.productId} className="hover:bg-flapp-lightBg transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-flapp-dark">{product.productId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-flapp-dark font-medium">${product.price.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-flapp-blue text-flapp-dark font-medium">
                  {product.quantity}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-green-600 font-medium">-${product.discount.toFixed(2)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium text-flapp-dark">
                ${((product.price * product.quantity) - product.discount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-flapp-lightBg">
            <td colSpan={4} className="px-6 py-4 text-right font-bold text-flapp-dark">
              Total
            </td>
            <td className="px-6 py-4 whitespace-nowrap font-bold text-flapp-dark">
              ${cartTotal.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CartTable;