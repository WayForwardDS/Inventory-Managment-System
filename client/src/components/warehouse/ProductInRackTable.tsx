// src/components/warehouse/ProductInRackTable.tsx
import React from 'react';
import { Table, Button } from 'antd';
import { ProductInRack } from '../../types/warehouse.type';

interface Props {
  products: ProductInRack[];
  onAction: (product: ProductInRack, action: 'in' | 'out' | 'delete') => void;
}

export const ProductInRackTable: React.FC<Props> = ({ products, onAction }) => {
  const columns = [
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ProductInRack) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => onAction(record, 'in')}>Stock In</Button>
          <Button size="small" onClick={() => onAction(record, 'out')}>Stock Out</Button>
          <Button size="small" danger onClick={() => onAction(record, 'delete')}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <Table
      rowKey="id"
      dataSource={products}
      columns={columns}
      pagination={false}
    />
  );
};
