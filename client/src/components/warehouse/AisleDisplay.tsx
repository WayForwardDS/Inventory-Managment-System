// import React, { useState } from 'react';
// import { Button, Card, Space, Typography, Input, Empty } from 'antd';
// import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
// import { NewRackForm } from './NewRackForm';
// import {RackCard}  from './RackCard';
// import { Aisle, Rack } from '../../types/warehouse.type';

// const { Title } = Typography;
// const { Search } = Input;

// const AisleDisplay: React.FC<{ aisle: Aisle }> = ({ aisle }) => {
//   const [racks, setRacks] = useState<Rack[]>(aisle.racks || []);
//   const [rackModalOpen, setRackModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredRacks = racks.filter(rack =>
//     rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     rack.barcode.includes(searchTerm)
//   );

//   const handleAddRack = (newRack: { name: string; barcode: string; capacity: number }) => {
//     const createdRack: Rack = {
//         ...newRack,
//         id: Date.now().toString(),
//         used: 0,
//         products: [],
//         aisleId: aisle.id,
//         fullness: 0
//     };
//     setRacks([...racks, createdRack]);
//     setRackModalOpen(false);
//   };

//   return (
//     <div>
//       <Space className="justify-between w-full mb-4">
//         <Title level={4}>Warehouse Rack Display: {aisle.name}</Title>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setRackModalOpen(true)}
//         >
//           Add New Rack
//         </Button>
//       </Space>

//       <Search
//         placeholder="Filter racks..."
//         prefix={<SearchOutlined />}
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-64 mb-4"
//       />

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {filteredRacks.length > 0 ? (
//           filteredRacks.map(rack => (
//             <RackCard
//                   key={rack.id}
//                   rack={rack}
//                   onDelete={() => setRacks(racks.filter(r => r.id !== rack.id))} onClick={function (): void {
//                       throw new Error('Function not implemented.');
//                   } }            />
//           ))
//         ) : (
//           <Card className="col-span-3">
//             <Empty description={
//               searchTerm 
//                 ? `No racks found matching "${searchTerm}"`
//                 : "No racks in this aisle yet"
//             } />
//           </Card>
//         )}
//       </div>

//       <NewRackForm
//         open={rackModalOpen}
//         onClose={() => setRackModalOpen(false)}
//         onSubmit={handleAddRack}
//       />
//     </div>
//   );
// };

// export { AisleDisplay };


import React, { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {NewRackForm} from './NewRackForm';
import {RackCard} from './RackCard';
import { Aisle, Rack } from '../../types/warehouse.type';

const { Title } = Typography;

const AisleDisplay: React.FC<{ aisle: Aisle }> = ({ aisle }) => {
  const [racks, setRacks] = useState<Rack[]>(aisle.racks);
  const [rackModalOpen, setRackModalOpen] = useState(false);

  const handleAddRack = (newRack: { name: string; barcode: string; capacity: number }) => {
    const createdRack: Rack = {
        ...newRack,
        id: Date.now().toString(),
        used: 0,
        products: [],
        aisleId: aisle.id,
        _id: undefined
    };
    setRacks([...racks, createdRack]);
    setRackModalOpen(false);
  };

  return (
    <div>
      <Space className="justify-between w-full mb-4">
        <Title level={4}>Warehouse Rack Display: {aisle.name}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setRackModalOpen(true)}
        >
          Add New Rack
        </Button>
      </Space>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {racks.map(rack => (
          <RackCard
                key={rack.id}
                rack={rack}
                onDelete={() => setRacks(racks.filter(r => r.id !== rack.id))} onClick={function (): void {
                    throw new Error('Function not implemented.');
                } }          />
        ))}
      </div>

      <NewRackForm
        open={rackModalOpen}
        onClose={() => setRackModalOpen(false)}
        onSubmit={handleAddRack}
      />
    </div>
  );
};

export default AisleDisplay;