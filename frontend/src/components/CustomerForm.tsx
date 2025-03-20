import React from 'react';
import { CustomerData } from '../services/api';

interface CustomerFormProps {
  customerData: CustomerData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customerData, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-flapp-dark mb-1">
          Nombre completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={customerData.name}
          onChange={onChange}
          className="w-full p-3 border border-flapp-lightGray rounded-md focus:ring-2 focus:ring-flapp-blue focus:border-transparent transition-all"
          placeholder="Ej: Juan Pérez"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-flapp-dark mb-1">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="phone"
          value={customerData.phone}
          onChange={onChange}
          className="w-full p-3 border border-flapp-lightGray rounded-md focus:ring-2 focus:ring-flapp-blue focus:border-transparent transition-all"
          placeholder="Ej: +56912345678"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-flapp-dark mb-1">
          Dirección <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="shipping_street"
          value={customerData.shipping_street}
          onChange={onChange}
          className="w-full p-3 border border-flapp-lightGray rounded-md focus:ring-2 focus:ring-flapp-blue focus:border-transparent transition-all"
          placeholder="Ej: Calle Falsa 123"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-flapp-dark mb-1">
          Comuna <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="commune"
          value={customerData.commune}
          onChange={onChange}
          className="w-full p-3 border border-flapp-lightGray rounded-md focus:ring-2 focus:ring-flapp-blue focus:border-transparent transition-all"
          placeholder="Ej: Vitacura"
        />
      </div>
      
      <p className="text-sm text-flapp-gray col-span-full">
        Los campos marcados con <span className="text-red-500">*</span> son obligatorios
      </p>
    </div>
  );
};

export default CustomerForm;