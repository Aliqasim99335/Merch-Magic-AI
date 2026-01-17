
import React from 'react';
import { ProductType } from '../types';

interface MockupCardProps {
  product: ProductType;
  isSelected: boolean;
  onClick: () => void;
}

export const MockupCard: React.FC<MockupCardProps> = ({ product, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-200 text-left ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="aspect-square relative overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
          <span className="text-4xl">{product.icon}</span>
        </div>
      </div>
      <div className="p-3 bg-white">
        <h3 className="font-semibold text-slate-800">{product.name}</h3>
        <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Mockup Template</p>
      </div>
    </button>
  );
};
