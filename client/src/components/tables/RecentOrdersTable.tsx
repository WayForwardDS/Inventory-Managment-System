import { Table, Tag } from 'antd';
import { IOrder } from '../../types/order.types';

const columns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    key: 'orderId',
  },
  {
    title: 'Customer',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => `$${amount.toFixed(2)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => (
      <Tag color={status === 'completed' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
];

const RecentOrdersTable = ({ data }: { data: IOrder[] }) => {
  return <Table 
    columns={columns} 
    dataSource={data} 
    pagination={false} 
    size="small" 
    rowKey="orderId" 
  />;
};

export default RecentOrdersTable;