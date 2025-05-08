import React from 'react';
import { ProductInRack } from '../../types/warehouse.type';

interface CustomActionButtonProps {
  label?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const CustomActionButton: React.FC<CustomActionButtonProps> = ({
  label,
  className,
  onClick,
  children,
}) => (
  <button
    className={`px-4 py-2 rounded-md text-white flex items-center justify-center gap-1 ${
      className || 'bg-blue-600 hover:bg-blue-700'
    }`}
    onClick={onClick}
  >
    {children || label}
  </button>
);

interface Props {
  product: ProductInRack;
  action: 'in' | 'out' | 'delete';
  onConfirm: () => void;
}

export const StockActionButton: React.FC<Props> = ({
  product,
  action,
  onConfirm,
}) => {
  const labelMap = {
    in: 'Confirm Stock In',
    out: 'Confirm Stock Out',
    delete: 'Confirm Delete',
  };

  const colorMap = {
    in: 'bg-green-600 hover:bg-green-700',
    out: 'bg-yellow-600 hover:bg-yellow-700',
    delete: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <div className="mt-2">
      <p className="mb-2 text-sm">
        Are you sure you want to <strong>{action}</strong> product{' '}
        <strong>{product.name}</strong> (Qty: {product.quantity})?
      </p>
      <CustomActionButton
        label={labelMap[action]}
        className={colorMap[action]}
        onClick={onConfirm}
      />
    </div>
  );
};
