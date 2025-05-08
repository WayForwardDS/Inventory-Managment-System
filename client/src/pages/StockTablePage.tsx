// import React, { useEffect, useState } from 'react';
// import { Table, Button, Space, Input, Tag, Popconfirm, Card } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
// import { useUpdateStockMutation } from '../redux/features/management/warehouseApt';
// import { ProductInRack } from '../types/warehouse.type';
// import { useOutletContext } from 'react-router-dom';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';
// import { AddStockForm } from '../components/warehouse/AddStockForm';

// const { Search } = Input;

// const StockTablePage = () => {
//   const { racks } = useOutletContext<{ racks: any[] }>();
//   const [updateStock] = useUpdateStockMutation();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingProduct, setEditingProduct] = useState<ProductInRack | null>(null);
//   const [editingRackId, setEditingRackId] = useState<string>('');

//   const handleDelete = async (product: ProductInRack, rackId: string) => {
//     try {
//       await updateStock({
//         type: 'DELETE',
//         productBarcode: product.barcode,
//         quantity: 0,
//         rackId,
//         timestamp: new Date().toISOString(),
//       }).unwrap();
//       toast.success('Stock item deleted successfully');
//     } catch (err) {
//       console.error('Failed to delete stock item:', err);
//       toast.error('Failed to delete stock item');
//     }
//   };

//   const getFilteredProducts = (products: ProductInRack[]) => {
//     return products.filter((p) =>
//       p.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const columns = (rackId: string) => [
//     {
//       title: 'Product Name',
//       dataIndex: 'name',
//       key: 'name',
//       render: (text: string) => <Tag color="blue">{text}</Tag>,
//     },
//     {
//       title: 'Barcode',
//       dataIndex: 'barcode',
//       key: 'barcode',
//     },
//     {
//       title: 'Quantity',
//       dataIndex: 'quantity',
//       key: 'quantity',
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       render: (_: any, record: ProductInRack) => (
//         <Space size="middle">
//           <Button
//             icon={<EditOutlined />}
//             type="primary"
//             size="small"
//             className="transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600"
//             onClick={() => {
//               setEditingProduct(record);
//               setEditingRackId(rackId);
//             }}
//           />
//           <Popconfirm
//             title="Are you sure to delete?"
//             onConfirm={() => handleDelete(record, rackId)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               icon={<DeleteOutlined />}
//               type="primary"
//               danger
//               size="small"
//               className="transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-red-600"
//             />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen p-8 ">
//       <h2 className="mb-8 text-3xl font-semibold text-center text-gray-800 drop-shadow-md">Stock Table by Rack</h2>

//       <div className="flex items-center justify-between mb-8">
//         <Search
//           placeholder="Search Product"
//           allowClear
//           enterButton="Search"
//           onSearch={setSearchTerm}
//           className="w-1/3 border-none rounded-lg shadow-md focus:ring-2 focus:ring-indigo-400"
//         />
//         <Button
//           type="primary"
//           className="transition-all duration-300 ease-in-out rounded-full shadow-2xl hover:scale-110"
//         >
//           Add New Stock
//         </Button>
//       </div>

//       <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//         {racks?.map((rack) => (
//           <motion.div
//             key={rack.id}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
//           >
//             <Card
//               title={`Rack: ${rack.name}`}
//               className="flex flex-col h-full p-4 transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:scale-105"
//             >
//               <Table
//                 dataSource={getFilteredProducts(rack.products)}
//                 columns={columns(rack.id)}
//                 rowKey="id"
//                 pagination={false}
//                 className="transition-transform duration-200 ease-in-out"
//                 rowClassName="transition-transform duration-200 hover:bg-gray-100"
//               />
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {editingProduct && (
//         <AddStockForm
//           rack={racks.find(r => r.id === editingRackId)}
//           product={editingProduct}
//           onClose={() => {
//             setEditingProduct(null);
//             setEditingRackId('');
//           }}
//           onProductSelect={() => {}}
//         />
//       )}
//     </div>
//   );
// };

// export default StockTablePage;

import React, { useState } from 'react';
import { Table, Button, Space, Input, Tag, Popconfirm, Card, Select } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useUpdateStockMutation } from '../redux/features/management/warehouseApt';
import { ProductInRack, Rack } from '../types/warehouse.type';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { AddStockForm } from '../components/warehouse/AddStockForm';

const { Search } = Input;

const StockTablePage = () => {
  const { racks } = useOutletContext<{ racks: Rack[] }>();
  const [updateStock] = useUpdateStockMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<ProductInRack | null>(null);
  const [editingRackId, setEditingRackId] = useState<string>('');
  const [showAddStockModal, setShowAddStockModal] = useState(false);

  const handleDelete = async (product: ProductInRack, rackId: string) => {
    try {
      await updateStock({
        type: 'DELETE',
        productBarcode: product.barcode,
        quantity: 0,
        rackId,
        timestamp: new Date().toISOString(),
      }).unwrap();
      toast.success('Stock item deleted successfully');
    } catch (err) {
      console.error('Failed to delete stock item:', err);
      toast.error('Failed to delete stock item');
    }
  };

  const getFilteredProducts = (products: ProductInRack[]) => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const columns = (rackId: string) => [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ProductInRack) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            className="transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-blue-600"
            onClick={() => {
              setEditingProduct(record);
              setEditingRackId(rackId);
            }}
          />
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record, rackId)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="primary"
              danger
              size="small"
              className="transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-red-600"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <h2 className="mb-8 text-3xl font-semibold text-center text-gray-800 drop-shadow-md">Stock Table by Rack</h2>

      <div className="flex items-center justify-between mb-8">
        <Search
          placeholder="Search Product"
          allowClear
          enterButton="Search"
          onSearch={setSearchTerm}
          className="w-1/3 border-none rounded-lg shadow-md focus:ring-2 focus:ring-indigo-400"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="transition-all duration-300 ease-in-out rounded-full shadow-2xl hover:scale-110"
          onClick={() => setShowAddStockModal(true)}
        >
          Add New Stock
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {racks?.map((rack) => (
          <motion.div
            key={rack.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            <Card
              title={`Rack: ${rack.name}`}
              className="flex flex-col h-full p-4 transition-all duration-300 transform bg-white shadow-lg rounded-2xl hover:scale-105"
            >
              <Table
                dataSource={getFilteredProducts(rack.products)}
                columns={columns(rack.id)}
                rowKey="id"
                pagination={false}
                className="transition-transform duration-200 ease-in-out"
                rowClassName="transition-transform duration-200 hover:bg-gray-100"
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {editingProduct && (
        <AddStockForm
          rack={racks.find(r => r.id === editingRackId)}
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            setEditingRackId('');
          }}
          onProductSelect={() => {}}
        />
      )}

      {showAddStockModal && (
        <AddStockForm
          racks={racks}
          onClose={() => setShowAddStockModal(false)}
          onProductSelect={() => {}}
        />
      )}
    </div>
  );
};

export default StockTablePage;