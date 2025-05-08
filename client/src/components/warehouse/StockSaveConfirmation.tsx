// src/components/warehouse/StockSaveConfirmation.tsx
import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

export const StockSaveConfirmation: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-4 text-green-500">
      <CheckCircleOutlined style={{ fontSize: '24px' }} />
      <span>Stock operation saved successfully!</span>
    </div>
  );
};
