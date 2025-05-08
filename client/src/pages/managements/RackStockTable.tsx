import React from "react";
import { CustomActionButton } from "../../components/warehouse/StockActionButtons";
import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProductInRack } from "../../types/warehouse.type";

interface RackStockTableProps {
  rack: {
    id: string;
    name: string;
    products: ProductInRack[];
  };
  onClose: () => void;
  onStockAction: (productId: string, action: 'In' | 'Out' | 'Delete') => void;
}

const RackStockTable: React.FC<RackStockTableProps> = ({
  rack,
  onClose,
  onStockAction,
}) => {
  return (
    <motion.div
      className="w-full max-w-4xl p-6 mx-auto mt-4 bg-white shadow-lg rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Products in {rack.name}
        </h2>
        <CustomActionButton onClick={onClose}>Close</CustomActionButton>
      </div>

      <table className="w-full text-sm border">
        <thead className="text-left bg-gray-100">
          <tr>
            <th className="p-2">Product Name</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Last Updated</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rack.products.map((prod) => (
            <tr key={prod.id} className="border-t">
              <td className="p-2">{prod.name}</td>
              <td className="p-2">{prod.quantity}</td>
              <td className="p-2">{prod.lastUpdated}</td>
              <td className="flex items-center gap-2 p-2">
                <CustomActionButton
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onStockAction(prod.id, 'In')}
                >
                  <ArrowDownCircle className="w-4 h-4" /> Stock In
                </CustomActionButton>
                <CustomActionButton
                  className="bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => onStockAction(prod.id, 'Out')}
                >
                  <ArrowUpCircle className="w-4 h-4" /> Stock Out
                </CustomActionButton>
                <CustomActionButton
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onStockAction(prod.id, 'Delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </CustomActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default RackStockTable;
