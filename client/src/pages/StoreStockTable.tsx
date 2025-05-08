import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Tag, Space, Popconfirm, notification } from 'antd';
import { SearchOutlined, DownloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useGetRacksQuery, useUpdateStockMutation } from '../redux/features/management/warehouseApt';
import { ProductInRack } from '../types/warehouse.type';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import * as XLSX from 'xlsx';

interface StoreStockTableProps {
  onProductSelect: (product: ProductInRack) => void;
}

export const StoreStockTable = ({ onProductSelect }: StoreStockTableProps) => {
  const { data: racks = [], isLoading } = useGetRacksQuery();
  const [updateStock] = useUpdateStockMutation();
  const [searchText, setSearchText] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  // Flatten all products from all racks
  const allProducts = racks.flatMap(rack => 
    rack.products.map(product => ({
      ...product,
      rackName: rack.name,
      rackId: rack.id
    }))
  );

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.barcode.includes(searchText) ||
    product.rackName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (productId: string, rackId: string) => {
    try {
      await updateStock({
        type: 'DELETE',
        productBarcode: productId,
        quantity: 0,
        rackId,
        timestamp: new Date().toISOString()
      }).unwrap();
      notification.success({
        message: 'Product Deleted',
        description: 'Product has been removed from inventory'
      });
    } catch (err) {
      notification.error({
        message: 'Error',
        description: 'Failed to delete product'
      });
    }
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProducts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "warehouse_inventory.xlsx");
  };

  const handlePrint = useReactToPrint({
    content: () => tableRef.current,
  });

  const columns = [
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
      sorter: (a: ProductInRack, b: ProductInRack) => a.quantity - b.quantity,
    },
    {
      title: 'Rack',
      dataIndex: 'rackName',
      key: 'rackName',
      render: (text: string, record: any) => (
        <Tag color="geekblue">
          {text} (ID: {record.rackId})
        </Tag>
      ),
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onProductSelect(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id, record.rackId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <Input
          placeholder="Search products..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full md:w-64"
        />
        <div className="flex space-x-2">
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <Button onClick={handlePrint}>Print</Button>
        </div>
      </div>

      <div ref={tableRef}>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          bordered
          title={() => (
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Complete Warehouse Inventory</h3>
              <span className="text-sm text-gray-500">
                Total Products: {filteredProducts.length}
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
};