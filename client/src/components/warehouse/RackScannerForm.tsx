// src/components/warehouse/RackScannerForm.tsx
import React, { useEffect } from 'react';
import { useScanBarcode } from '../../hooks/useScanBarcode';

interface Props {
  onRackDetected: (rackBarcode: string) => void;
}

export const RackScannerForm: React.FC<Props> = ({ onRackDetected }) => {
  const { barcode, setBarcode } = useScanBarcode();

  useEffect(() => {
    if (barcode.length > 5) {
      onRackDetected(barcode);
      setBarcode('');
    }
  }, [barcode]);

  return (
    <div className="p-4 mb-4 text-white bg-gray-700 rounded">
      <p>Scan Rack Barcode to Load Contents</p>
      <p className="font-mono text-blue-400">{barcode}</p>
    </div>
  );
};
