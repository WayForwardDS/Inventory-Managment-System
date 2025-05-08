import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { AisleDropdownMenu } from './AisleDropdownMenu';
import { Aisle } from '../../types/warehouse.type';

interface AisleTabsProps {
  aisles: Aisle[];
  selectedAisleId: string | null;
  onSelectAisle: (aisleId: string) => void;
  onAddAisleClick: () => void;
}

const isAisleFull = (aisle: Aisle) => {
  return aisle.racks.length > 0 && 
         aisle.racks.every(rack => (rack.used / rack.capacity) >= 1);
};

export const AisleTabs: React.FC<AisleTabsProps> = ({ 
  aisles, 
  selectedAisleId,
  onSelectAisle,
  onAddAisleClick 
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const { visibleAisles, hiddenAisles } = useMemo(() => {
    const maxVisible = 6;
    const visible = aisles.slice(0, maxVisible);
    const hidden = aisles.slice(maxVisible);
    return { visibleAisles: visible, hiddenAisles: hidden };
  }, [aisles]);

  return (
    <div className="flex items-center border-b border-gray-200">
      <div className="flex flex-1 overflow-x-auto">
        {visibleAisles.map((aisle) => (
          <motion.div
            key={aisle.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <button
              onClick={() => onSelectAisle(aisle.id)}
              className={`px-4 py-2 font-medium text-sm focus:outline-none ${
                selectedAisleId === aisle.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              style={{
                backgroundColor: isAisleFull(aisle) ? '#fee2e2' : 'transparent'
              }}
            >
              {aisle.name}
              {isAisleFull(aisle) && (
                <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {hiddenAisles.length > 0 && (
        <AisleDropdownMenu
          aisles={hiddenAisles}
          visible={dropdownVisible}
          onVisibleChange={setDropdownVisible}
          onSelect={onSelectAisle}
        />
      )}

      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={onAddAisleClick}
          className="ml-2"
        >
          Add Aisle
        </Button>
      </motion.div>
    </div>
  );
};


// import { useState } from 'react';
// import { AddAisleForm } from './AddAisleForm';
// import { AisleDropdownMenu } from './AisleDropdownMenu';
// import { AisleDisplay } from './AisleDisplay';

// export const AisleTabs = ({ aisles, selectedAisle, onAddAisle, onSelectAisle, onAddRack }) => {
//   const [showAddForm, setShowAddForm] = useState(false);
//   const MAX_VISIBLE_TABS = 6;

//   const visibleAisles = aisles.slice(0, MAX_VISIBLE_TABS);
//   const overflowAisles = aisles.slice(MAX_VISIBLE_TABS);

//   return (
//     <div className="mb-4">
//       <div className="flex items-center border-b-2 border-gray-200">
//         {/* Visible Tabs */}
//         {visibleAisles.map(aisle => (
//           <button
//             key={aisle.id}
//             onClick={() => onSelectAisle(aisle.id)}
//             className={`px-4 py-2 mr-1 transition-all duration-300 ${
//               selectedAisle === aisle.id 
//                 ? 'border-b-4 border-blue-500 font-bold' 
//                 : 'hover:bg-gray-100'
//             } ${
//               aisle.colorStatus === 'red' ? 'bg-red-100 text-red-700' : 'bg-white'
//             }`}
//           >
//             {aisle.name}
//           </button>
//         ))}

//         {/* Add New Tab Button */}
//         <button
//           onClick={() => setShowAddForm(true)}
//           className="p-2 mx-1 text-white transition-colors bg-green-500 rounded hover:bg-green-600"
//         >
//           +
//         </button>

//         {/* Dropdown for Overflow Aisles */}
//         {overflowAisles.length > 0 && (
//           <AisleDropdownMenu 
//             aisles={overflowAisles}
//             onSelect={onSelectAisle}
//           />
//         )}
//       </div>

//       {/* Aisle Content Display */}
//       {selectedAisle && (
//         <AisleDisplay 
//           aisle={aisles.find(a => a.id === selectedAisle)}
//           onAddRack={onAddRack}
//         />
//       )}

//       {/* Add Aisle Form */}
//       {showAddForm && (
//         <AddAisleForm
//           onClose={() => setShowAddForm(false)}
//           onSubmit={(name, date) => {
//             onAddAisle(name, date);
//             setShowAddForm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };