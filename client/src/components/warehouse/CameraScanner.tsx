// src/components/warehouse/CameraScanner.tsx
import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Props {
  onBarcodeDetected: (barcode: string) => void;
}

export const CameraScanner: React.FC<Props> = ({ onBarcodeDetected }) => {
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "camera-scanner",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        disableFlip: true,
        aspectRatio: 1.0
      },
      false
    );

    scanner.render(
      (decodedText) => {
        if (/^\d+$/.test(decodedText)) {
          onBarcodeDetected(decodedText);
        }
      },
      (errorMessage) => {
        // You can log errors if needed
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onBarcodeDetected]);

  return <div ref={scannerRef} id="camera-scanner" className="my-4" />;
};
