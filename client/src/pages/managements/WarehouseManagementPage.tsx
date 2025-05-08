// import { useState } from 'react';
// import { useGetRacksQuery } from '../../redux/features/management/warehouseApt';
// import { CameraScanner } from '../../components/warehouse/CameraScanner';
// import { toast } from 'sonner';
// import { CameraIcon, XIcon } from 'lucide-react';
// import { Outlet } from 'react-router-dom';

// export const WarehouseManagementPage = () => {
//   const { data: racks = [], isLoading } = useGetRacksQuery();
//   const [showScanner, setShowScanner] = useState(false);

//   const handleBarcodeDetected = (barcode: string) => {
//     const foundRack = racks.find(r => r.id === barcode || r.name === barcode);
//     if (foundRack) {
//       toast.success(`Found rack: ${foundRack.name}`);
//       setShowScanner(false);
//     } else {
//       toast.error(`No rack found for barcode: ${barcode}`);
//     }
//   };

//   if (isLoading) return <div>Loading racks...</div>;

//   return (
//     <div className="container p-4 mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between p-2 mb-6 border-2 border-gray-400 rounded-md">
//         <h1 className="text-2xl font-bold text-white">Warehouse Management</h1>
//         <button
//           onClick={() => setShowScanner(true)}
//           className="p-2 transition duration-200 bg-gray-200 rounded-full hover:bg-gray-300"
//         >
//           <CameraIcon className="w-6 h-6 text-gray-700" />
//         </button>
//       </div>

//       {/* Scanner Modal */}
//       {showScanner && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="relative w-full max-w-md p-6 bg-white shadow-lg rounded-xl">
//             <button
//               onClick={() => setShowScanner(false)}
//               className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
//             >
//               <XIcon className="w-5 h-5" />
//             </button>
//             <CameraScanner onBarcodeDetected={handleBarcodeDetected} />
//           </div>
//         </div>
//       )}

//       {/* Subroute content with Outlet context */}
//       <Outlet context={{ racks }} />
//     </div>
//   );
// };


import { useState } from 'react';
import { 
  useGetRacksQuery, 
  useGetAislesQuery,
  useAddAisleMutation 
} from '../../redux/features/management/warehouseApt';
import { CameraScanner } from '../../components/warehouse/CameraScanner';
import { toast } from 'sonner';
import { CameraIcon, XIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import {AisleTabs} from '../../components/warehouse/AisleTabs';
import {AddAisleForm} from '../../components/warehouse/AddAisleForm';

export const WarehouseManagementPage = () => {
  const { data: racks = [], isLoading: isLoadingRacks } = useGetRacksQuery();
  const { data: aisles = [], isLoading: isLoadingAisles } = useGetAislesQuery();
  const [addAisle] = useAddAisleMutation();
  const [showScanner, setShowScanner] = useState(false);
  const [showAddAisle, setShowAddAisle] = useState(false);

  const handleBarcodeDetected = (barcode: string) => {
    const foundRack = racks.find(r => r.id === barcode || r.name === barcode);
    if (foundRack) {
      toast.success(`Found rack: ${foundRack.name}`);
      setShowScanner(false);
    } else {
      toast.error(`No rack found for barcode: ${barcode}`);
    }
  };

  const handleAddAisle = async (values: { name: string; size: string }) => {
    try {
      await addAisle(values).unwrap();
      toast.success(`Aisle ${values.name} created successfully`);
      setShowAddAisle(false);
    } catch (error) {
      toast.error('Failed to create aisle');
      console.error('Error creating aisle:', error);
    }
  };

  if (isLoadingRacks || isLoadingAisles) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading warehouse data...</div>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 mb-6 bg-white rounded-lg shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Warehouse Management</h1>
          <p className="text-sm text-gray-500">
            {aisles.length} aisles • {racks.length} racks
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddAisle(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add Aisle
          </button>
          <button
            onClick={() => setShowScanner(true)}
            className="p-2 transition duration-200 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <CameraIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Aisle Navigation */}
      <div className="mb-6">
        <AisleTabs aisles={aisles} selectedAisleId={null} onSelectAisle={function (aisleId: string): void {
          throw new Error('Function not implemented.');
        } } onAddAisleClick={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <button
              onClick={() => setShowScanner(false)}
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <CameraScanner onBarcodeDetected={handleBarcodeDetected} />
          </div>
        </div>
      )}

      {/* Add Aisle Modal */}
      <AddAisleForm
        open={showAddAisle}
        onClose={() => setShowAddAisle(false)}
        onSubmit={handleAddAisle}
      />

      {/* Subroute content with Outlet context */}
      <Outlet context={{ aisles, racks }} />
    </div>
  );
};