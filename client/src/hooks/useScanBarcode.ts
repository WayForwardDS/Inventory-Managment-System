import { useState, useEffect } from 'react';

export const useScanBarcode = (initialValue = '') => {
  const [barcode, setBarcode] = useState(initialValue);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsScanning(false);
        return;
      }
      
      setIsScanning(true);
      setBarcode(prev => prev + e.key);
      
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsScanning(false);
        setBarcode('');
      }, 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  return { barcode, isScanning, setBarcode };
};