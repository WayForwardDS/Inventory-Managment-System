// import React from 'react';
// import { WarehouseProduct}  from '../../types/warehouse.type';

// interface Props {
//   products: WarehouseProduct[];
//   selectedProducts: WarehouseProduct[];
//   onStockAction: (productId: string, action: 'In' | 'Out' | 'Delete') => void;
//   setSelectedProducts: React.Dispatch<React.SetStateAction<WarehouseProduct[]>>;
// }

// export const WarehouseProductTable: React.FC<Props> = ({
//   products,
//   selectedProducts,
//   onStockAction,
//   setSelectedProducts,
// }) => {
//   // Add stockAction to products if missing
//   React.useEffect(() => {
//     const withActions = products.map((p) => ({
//       ...p,
//       stockAction: selectedProducts.find(sp => sp._id === p._id)?.stockAction || '',
//     }));
//     setSelectedProducts(withActions);
//   }, [products]);

//   return (
//     <div className="mt-6 overflow-x-auto">
//       <table className="w-full border border-gray-300 rounded-lg table-auto">
//         <thead className="text-left bg-gray-100">
//           <tr>
//             <th className="p-3">#</th>
//             <th className="p-3">Product Name</th>
//             <th className="p-3">Quantity</th>
//             <th className="p-3">Rack ID</th>
//             <th className="p-3">Stock Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map((prod, index) => (
//             <tr key={prod._id} className="border-t">
//               <td className="p-3">{index + 1}</td>
//               <td className="p-3">{prod.name}</td>
//               <td className="p-3">{prod.quantity}</td>
//               <td className="p-3">{prod.rackId}</td>
//               <td className="p-3 space-x-2">
//                 {['In', 'Out', 'Delete'].map((action) => (
//                   <button
//                     key={action}
//                     onClick={() => onStockAction(prod._id, action as 'In' | 'Out' | 'Delete')}
//                     className={`px-3 py-1 rounded-xl text-sm font-medium ${
//                       selectedProducts.find(p => p._id === prod._id)?.stockAction === action
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-700'
//                     }`}
//                   >
//                     {action}
//                   </button>
//                 ))}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

import React from 'react';
import { WarehouseProduct } from '../../types/warehouse.type';

interface Props {
  products: WarehouseProduct[];
  selectedProducts: WarehouseProduct[];
  onStockAction: (productId: string, action: 'In' | 'Out' | 'Delete') => void;
  setSelectedProducts: React.Dispatch<React.SetStateAction<WarehouseProduct[]>>;
}

export const WarehouseProductTable: React.FC<Props> = ({
  products,
  selectedProducts,
  onStockAction,
  setSelectedProducts,
}) => {
  // Add stockAction to products if missing
  React.useEffect(() => {
    const withActions = products.map((p) => ({
      ...p,
      stockAction: selectedProducts.find(sp => sp._id === p._id)?.stockAction || '',
    }));
    setSelectedProducts(withActions);
  }, [products]);

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border border-gray-300 rounded-lg table-auto">
        <thead className="text-left bg-gray-100">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Product Name</th>
            <th className="p-3">Quantity</th>
            <th className="p-3">Rack ID</th>
            <th className="p-3">Stock Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod._id} className="border-t">
              <td className="p-3">{index + 1}</td>
              <td className="p-3">{prod.name}</td>
              <td className="p-3">{prod.quantity}</td>
              <td className="p-3">{prod.rackId}</td>
              <td className="p-3 space-x-2">
                {['In', 'Out', 'Delete'].map((action) => (
                  <button
                    key={action}
                    onClick={() => onStockAction(prod._id, action as 'In' | 'Out' | 'Delete')}
                    className={`px-3 py-1 rounded-xl text-sm font-medium ${
                      selectedProducts.find(p => p._id === prod._id)?.stockAction === action
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
