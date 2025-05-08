// import React, { useState } from 'react';

// interface Props {
//   onSubmit: (barcode: string) => void;
// }

// export const BarcodeScannerForm: React.FC<Props> = ({ onSubmit }) => {
//   const [barcode, setBarcode] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!barcode.trim()) return;
//     onSubmit(barcode.trim());
//     setBarcode('');
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-4">
//       <input
//         type="text"
//         placeholder="Scan or enter barcode"
//         value={barcode}
//         onChange={(e) => setBarcode(e.target.value)}
//         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 text-white transition bg-green-600 rounded-xl hover:bg-green-700"
//       >
//         Scan
//       </button>
//     </form>
//   );
// };




import React, { useState } from 'react';

interface Props {
  onSubmit: (barcode: string) => void;
}

export const BarcodeScannerForm: React.FC<Props> = ({ onSubmit }) => {
  const [barcode, setBarcode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode.trim()) return;
    onSubmit(barcode.trim());
    setBarcode('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Scan or enter barcode"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-xl"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white transition bg-green-600 rounded-xl hover:bg-green-700"
      >
        Scan
      </button>
    </form>
  );
};
