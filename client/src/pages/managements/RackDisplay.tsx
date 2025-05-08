// // src/pages/warehouse/RackDisplay.tsx
// import { useState, useMemo } from 'react';
// import { Button } from 'antd';
// import { RackCard } from '../../components/warehouse/RackCard';
// import { AddStockForm } from '../../components/warehouse/AddStockForm';
// import { ProductInRack, Rack } from '../../types/warehouse.type';
// import { useOutletContext } from 'react-router-dom';
// import { NewRackForm } from '../../components/warehouse/NewRackForm';

// interface OutletContextType {
//   racks: Rack[];
// }

// export const RackDisplay = () => {
//   const { racks: contextRacks } = useOutletContext<OutletContextType>();
//   const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
//   const [rackModalOpen, setRackModalOpen] = useState(false);
//   const [racks, setRacks] = useState<Rack[]>(contextRacks);

//   const sortedRacks = useMemo(() => {
//     return [...racks].sort((a, b) => {
//       const aPercentage = (a.used / a.capacity) * 100;
//       const bPercentage = (b.used / b.capacity) * 100;
      
//       if (a.used === 0 && b.used !== 0) return -1;
//       if (a.used !== 0 && b.used === 0) return 1;
      
//       return aPercentage - bPercentage;
//     });
//   }, [racks]);

//   const handleAddRack = (newRack: { name: string; barcode: string; capacity: number, used: number }) => {
//     const createdRack: Rack = {
//       id: Date.now().toString(),
//       name: newRack.name,
//       barcode: newRack.barcode,
//       capacity: newRack.capacity,
//       used: newRack.used, // Use the actual used value from the form
//       products: [],
//     };
//     setRacks((prev) => [...prev, createdRack]);
//     setRackModalOpen(false);
//   };

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Warehouse Rack Display</h2>
//         <Button type="primary" onClick={() => setRackModalOpen(true)}>
//           + Add New Rack
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {sortedRacks.map((rack) => (
//           <RackCard
//             key={rack.id}
//             rack={rack}
//             onClick={() => setSelectedRack(rack)}
//             onDelete={() =>
//               setRacks((prev) => prev.filter((r) => r.id !== rack.id))
//             }
//           />
//         ))}
//       </div>

//       {selectedRack && (
//         <AddStockForm
//           rack={selectedRack}
//           onClose={() => setSelectedRack(null)}
//           onProductSelect={(product: ProductInRack) => {
//             // Handle product selection if needed
//           }}
//         />
//       )}

//       <NewRackForm
//         open={rackModalOpen}
//         onClose={() => setRackModalOpen(false)}
//         onSubmit={handleAddRack}
//       />
//     </div>
//   );
// };


// import { useState, useMemo } from 'react';
// import { Button, message } from 'antd';
// import { RackCard } from '../../components/warehouse/RackCard';
// import { AddStockForm } from '../../components/warehouse/AddStockForm';
// import { ProductInRack, Rack } from '../../types/warehouse.type';
// import { useOutletContext } from 'react-router-dom';
// import { NewRackForm } from '../../components/warehouse/NewRackForm';
// import { useDeleteRackMutation } from '../../redux/features/management/warehouseApt';
// import { toast } from 'sonner';

// interface OutletContextType {
//   aisles: {
//     id: string;
//     name: string;
//     racks: Rack[];
//   }[];
//   racks: Rack[];
//   selectedAisleId: string | null;
//   onAddRack: (rack: { name: string; barcode: string; capacity: number }) => void;
// }

// export const RackDisplay = () => {
//   const { aisles, racks, selectedAisleId, onAddRack } = useOutletContext<OutletContextType>();
//   const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
//   const [rackModalOpen, setRackModalOpen] = useState(false);
//   const [deleteRack] = useDeleteRackMutation();

//   // Get racks for the selected aisle
//   const aisleRacks = useMemo(() => {
//     if (!selectedAisleId) return [];
//     return racks.filter(rack => rack.aisleId === selectedAisleId);
//   }, [racks, selectedAisleId]);

//   // Get current aisle name for display
//   const currentAisleName = useMemo(() => {
//     if (!selectedAisleId) return '';
//     const aisle = aisles.find(a => a.id === selectedAisleId);
//     return aisle?.name || '';
//   }, [aisles, selectedAisleId]);

//   // Sort racks by usage percentage
//   const sortedRacks = useMemo(() => {
//     return [...aisleRacks].sort((a, b) => {
//       const aPercentage = (a.used / a.capacity) * 100;
//       const bPercentage = (b.used / b.capacity) * 100;
      
//       // Empty racks first
//       if (a.used === 0 && b.used !== 0) return -1;
//       if (a.used !== 0 && b.used === 0) return 1;
      
//       // Then sort by usage percentage
//       return aPercentage - bPercentage;
//     });
//   }, [aisleRacks]);

//   const handleAddRack = (newRack: { name: string; barcode: string; capacity: number }) => {
//     onAddRack(newRack);
//     setRackModalOpen(false);
//   };

//   const handleDeleteRack = async (rackId: string) => {
//     try {
//       await deleteRack(rackId).unwrap();
//       toast.success('Rack deleted successfully');
//       setSelectedRack(null);
//     } catch (error) {
//       toast.error('Failed to delete rack');
//       console.error('Error deleting rack:', error);
//     }
//   };

//   if (!selectedAisleId) {
//     return (
//       <div className="p-4">
//         <h2 className="mb-4 text-xl font-semibold">Warehouse Rack Display</h2>
//         <div className="text-gray-500">Please select an aisle to view its racks</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold">Warehouse Rack Display - {currentAisleName}</h2>
//         <Button 
//           type="primary" 
//           onClick={() => setRackModalOpen(true)}
//           disabled={!selectedAisleId}
//         >
//           + Add New Rack
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {sortedRacks.map((rack) => (
//           <RackCard
//             key={rack.id}
//             rack={rack}
//             onClick={() => setSelectedRack(rack)}
//             onDelete={() => handleDeleteRack(rack.id)}
//           />
//         ))}
//       </div>

//       {sortedRacks.length === 0 && (
//         <div className="py-8 text-center text-gray-500">
//           No racks found in this aisle. Click "Add New Rack" to create one.
//         </div>
//       )}

//       {selectedRack && (
//         <AddStockForm
//           rack={selectedRack}
//           onClose={() => setSelectedRack(null)}
//           onProductSelect={(product: ProductInRack) => {
//             // Handle product selection if needed
//           }}
//         />
//       )}

//       <NewRackForm
//         open={rackModalOpen}
//         onClose={() => setRackModalOpen(false)}
//         onSubmit={handleAddRack}
//       />
//     </div>
//   );
// };

// src/pages/warehouse/RackDisplay.tsx
import { useState, useMemo } from 'react';
import { Button } from 'antd';
import { RackCard } from '../../components/warehouse/RackCard';
import { AddStockForm } from '../../components/warehouse/AddStockForm';
import { ProductInRack, Rack } from '../../types/warehouse.type';
import { useOutletContext } from 'react-router-dom';
import { NewRackForm } from '../../components/warehouse/NewRackForm';

interface OutletContextType {
  racks: Rack[];
}

export const RackDisplay = () => {
  const { racks: contextRacks } = useOutletContext<OutletContextType>();
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [rackModalOpen, setRackModalOpen] = useState(false);
  const [racks, setRacks] = useState<Rack[]>(contextRacks);

  const sortedRacks = useMemo(() => {
    return [...racks].sort((a, b) => {
      const aPercentage = (a.used / a.capacity) * 100;
      const bPercentage = (b.used / b.capacity) * 100;
      
      if (a.used === 0 && b.used !== 0) return -1;
      if (a.used !== 0 && b.used === 0) return 1;
      
      return aPercentage - bPercentage;
    });
  }, [racks]);

  const handleAddRack = (newRack: { name: string; barcode: string; capacity: number, used: number }) => {
    const createdRack: Rack = {
      id: Date.now().toString(),
      name: newRack.name,
      barcode: newRack.barcode,
      capacity: newRack.capacity,
      used: newRack.used, // Use the actual used value from the form
      products: [],
      _id: undefined,
      aisleId: ''
    };
    setRacks((prev) => [...prev, createdRack]);
    setRackModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Warehouse Rack Display</h2>
        <Button type="primary" onClick={() => setRackModalOpen(true)}>
          + Add New Rack
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedRacks.map((rack) => (
          <RackCard
            key={rack.id}
            rack={rack}
            onClick={() => setSelectedRack(rack)}
            onDelete={() =>
              setRacks((prev) => prev.filter((r) => r.id !== rack.id))
            }
          />
        ))}
      </div>

      {selectedRack && (
        <AddStockForm
          rack={selectedRack}
          onClose={() => setSelectedRack(null)}
          onProductSelect={(product: ProductInRack) => {
            // Handle product selection if needed
          }}
        />
      )}

      <NewRackForm
        open={rackModalOpen}
        onClose={() => setRackModalOpen(false)}
        onSubmit={handleAddRack}
      />
    </div>
  );
};