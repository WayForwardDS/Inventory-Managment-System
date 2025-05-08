// import React from 'react';
// import { Card, Tag, Tooltip, Badge, Progress } from 'antd';
// import { 
//   HomeOutlined, 
//   EditOutlined, 
//   DeleteOutlined, 
//   PercentageOutlined, 
//   InboxOutlined,
//   ExclamationCircleFilled 
// } from '@ant-design/icons';
// import { motion } from 'framer-motion';
// import { Rack } from '../../types/warehouse.type';

// interface RackCardProps {
//   rack: Rack;
//   onClick: () => void;
//   onDelete: () => void;
// }

// export const RackCard = ({ rack, onClick, onDelete }: RackCardProps) => {
//   const usagePercentage = Math.round((rack.used / rack.capacity) * 100);
//   const isFull = usagePercentage >= 100;
//   const isCritical = usagePercentage >= 90 && !isFull;

//   // Color scheme based on usage
//   const statusColors = {
//     empty: '#52c41a',   
//     normal: '#1890ff',  
//     critical: '#faad14',
//     full: '#ff4d4f'   
//   };

//   const statusColor = isFull ? statusColors.full :
//                      isCritical ? statusColors.critical :
//                      rack.used === 0 ? statusColors.empty : 
//                      statusColors.normal;

//   return (
//     <motion.div
//       onClick={onClick}
//       className="cursor-pointer"
//       whileHover={{ scale: 1.03 }}
//       whileTap={{ scale: 0.98 }}
//       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//     >
//       <Card
//         bordered={false}
//         className={`relative transition-all shadow-md w-72 h-64 rounded-2xl bg-white/90 backdrop-blur-lg hover:shadow-xl ${
//           isFull ? 'ring-2 ring-red-500' : ''
//         }`}
//       >
//         {/* Full Rack Ribbon */}
//         {isFull && (
//           <Badge.Ribbon 
//             text="FULL" 
//             color="red"
//             className="absolute font-bold -top-1 -right-1"
//           />
//         )}

//         {/* Critical Warning */}
//         {isCritical && (
//           <div className="absolute text-yellow-500 top-2 right-2">
//             <ExclamationCircleFilled className="text-xl" />
//           </div>
//         )}

//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <HomeOutlined className="text-gray-500" />
//             <span className="text-sm font-semibold text-gray-700">{rack.name}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Tooltip title="Edit Rack">
//               <EditOutlined 
//                 className="text-sm text-blue-500 hover:text-blue-700"
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </Tooltip>
//             <Tooltip title="Delete Rack">
//               <DeleteOutlined
//                 className="text-sm text-red-500 hover:text-red-700"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDelete();
//                 }}
//               />
//             </Tooltip>
//           </div>
//         </div>

//         {/* Circular Progress - Always shows usage percentage */}
//         <div className="flex flex-col items-center justify-center mt-2">
//           <Progress
//             type="dashboard"
//             percent={usagePercentage}
//             strokeColor={statusColor}
//             strokeWidth={10}
//             trailColor="#f0f0f0"
//             format={() => (
//               <div className="text-center">
//                 <span className="text-2xl font-bold">{usagePercentage}%</span>
//                 <div className="mt-1 text-xs text-gray-500">
//                   {rack.used === 0 ? 'Empty' : 'Usage'}
//                 </div>
//               </div>
//             )}
//             width={120}
//           />
//         </div>

//         {/* Rack Stats */}
//         <div className="absolute bottom-4 left-4 right-4">
//           <div className="flex items-center justify-between mb-2">
//             <Tag icon={<PercentageOutlined />} color="blue">
//               Capacity: {rack.capacity}
//             </Tag>
//             <Tag color={rack.used === 0 ? 'green' : isFull ? 'red' : 'blue'}>
//               Used: {rack.used}
//             </Tag>
//           </div>
//           <div className="w-full h-2 bg-gray-200 rounded-full">
//             <div 
//               className="h-2 rounded-full"
//               style={{
//                 width: `${usagePercentage}%`,
//                 backgroundColor: statusColor
//               }}
//             />
//           </div>
//         </div>

//         {/* Barcode Tag */}
//         {rack.barcode && (
//           <div className="absolute top-4 left-4">
//             <Tag icon={<InboxOutlined />} color="geekblue">
//               {rack.barcode}
//             </Tag>
//           </div>
//         )}
//       </Card>
//     </motion.div>
//   );
// };



import React from 'react';
import { Card, Tag, Tooltip, Badge, Progress } from 'antd';
import { 
  HomeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PercentageOutlined, 
  InboxOutlined,
  ExclamationCircleFilled 
} from '@ant-design/icons';
import { motion } from 'framer-motion';

interface Rack {
  id: string;
  name: string;
  barcode: string;
  capacity: number; // This should be the percentage value (0-100)
  used: number;     // Actual units used
  products: any[];
}

interface RackCardProps {
  rack: Rack;
  onClick: () => void;
  onDelete: () => void;
}

export const RackCard = ({ rack, onClick, onDelete }: RackCardProps) => {
  // Calculate usage percentage (used units vs capacity percentage)
  const usagePercentage = Math.round((rack.used / rack.capacity) * 100);
  const isFull = usagePercentage >= 100;
  const isCritical = usagePercentage >= 90 && !isFull;

  // Color scheme based on usage percentage
  const getStatusColor = () => {
    if (isFull) return '#ff4d4f';      // Red for full
    if (isCritical) return '#faad14';  // Yellow for critical
    if (rack.used === 0) return '#52c41a'; // Green for empty
    return '#1890ff';                  // Blue for normal
  };

  return (
    <motion.div
      onClick={onClick}
      className="cursor-pointer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        bordered={false}
        className={`relative w-72 h-64 rounded-2xl shadow-lg ${
          isFull ? 'ring-2 ring-red-500' : ''
        }`}
      >
        {/* FULL Badge (shown when 100% capacity) */}
        {isFull && (
          <Badge.Ribbon 
            text="FULL" 
            color="red"
            className="absolute font-bold -top-1 -right-1"
          />
        )}

        {/* Warning icon (shown when ≥90% capacity) */}
        {isCritical && (
          <div className="absolute text-yellow-500 top-2 right-2">
            <ExclamationCircleFilled className="text-xl" />
          </div>
        )}

        {/* Rack Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HomeOutlined className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">{rack.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip title="Edit Rack">
              <EditOutlined 
                className="text-sm text-blue-500 hover:text-blue-700"
                onClick={(e) => e.stopPropagation()}
              />
            </Tooltip>
            <Tooltip title="Delete Rack">
              <DeleteOutlined
                className="text-sm text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              />
            </Tooltip>
          </div>
        </div>

        {/* Circular Progress Display */}
        <div className="flex flex-col items-center justify-center mt-2">
          <Progress
            type="dashboard"
            percent={usagePercentage}
            strokeColor={getStatusColor()}
            strokeWidth={10}
            trailColor="#f0f0f0"
            format={() => (
              <div className="text-center">
                <span className="text-2xl font-bold">{usagePercentage}%</span>
                <div className="mt-1 text-xs text-gray-500">
                  {rack.used === 0 ? 'Empty' : 'Usage'}
                </div>
              </div>
            )}
            width={120}
          />
        </div>

        {/* Capacity Stats Bar */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between mb-2">
            <Tag icon={<PercentageOutlined />} color="blue">
              Capacity: {rack.capacity}%
            </Tag>
            <Tag color={rack.used === 0 ? 'green' : isFull ? 'red' : 'blue'}>
              Used: {rack.used}%
            </Tag>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 rounded-full"
              style={{
                width: `${usagePercentage}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
        </div>

        {/* Barcode Display */}
        {rack.barcode && (
          <div className="absolute top-4 left-4">
            <Tag icon={<InboxOutlined />} color="geekblue">
              {rack.barcode}
            </Tag>
          </div>
        )}
      </Card>
    </motion.div>
  );
};