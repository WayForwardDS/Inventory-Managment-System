import { DeleteFilled, EyeOutlined } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table, Tag } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} from '../../redux/features/management/orderApi';
import { IOrder } from '../../types/order.types';
import toastMessage from '../../lib/toastMessage';
import { useGetSelfProfileQuery } from '../../redux/features/authApi';
import { useGetChemicalDetails } from '../../hooks/useGetChemicalsDetails';
import { useGetAllChemicalsQuery } from '../../redux/features/management/chemicalApi';
import formatDateLocal from '../../utils/formatDateLocal';
import SearchInput from '../../components/SearchInput';

const OrdersRequestPage = () => {
  const [usersRole, setUsersRole] = useState();
  const { data: userData } = useGetSelfProfileQuery(undefined);

  const [query, setQuery] = useState({
    status: 'pending',
    page: 1,
    limit: 15,
  });

  const { data: orders, isFetching, refetch } = useGetAllOrdersQuery(query);
  const { data: chemicals } = useGetAllChemicalsQuery({});

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    refetch();
  }, [query, refetch]);

  useEffect(() => {
    if (userData) {
      setUsersRole(userData.data.role);
    }
  }, [userData]);

  // Process table data
  const tableData = useMemo(() => {
    if (!orders?.data || !chemicals?.data) return [];

    const chemicalsMap = new Map(
      chemicals.data.map((chemical: any) => [chemical._id, chemical])
    );

    return orders.data
      .filter((order: IOrder) => order.status !== "completed")
      .map((order: IOrder) => {
        const createdAtDate = order.createdAt ? new Date(order.createdAt) : null;
        const formattedCreatedAt = createdAtDate
          ? `${createdAtDate.getMonth() + 1}/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`
          : 'N/A';

        let chemicalsDisplay = 'N/A';
        if (order.product[0]?.chemicals) {
          chemicalsDisplay = order.product[0]?.chemicals
            .map((chem: any) => {
              const chemicalDetails = chemicalsMap.get(chem.chemicalId);
              return `${chemicalDetails?.name || 'Unknown'}`;
            })
            .join(', ');
        }

        return {
          key: order._id,
          product: order.product,
          quantity: order.quantity,
          chemicals: chemicalsDisplay,
          totalPrice: usersRole !== 'Mixture' && usersRole !== 'Stock-Manager' 
            ? `Rs. ${order.totalPrice.toFixed(0)}` 
            : undefined,
          status: order.status,
          additionalMessage: order.additionalMessage,
          createdBy: order.createdBy,
          acknowledgedBy: order.acknowledgedBy,
          readyBy: order.readyBy,
          readyDate: order.readyDate,
          completedBy: order.completedBy,
          completedAt: order.completedAt,
          createdAt: formattedCreatedAt,
        };
      });
  }, [orders, chemicals, usersRole]);


  const columns: TableColumnsType<IOrder & { key: string }> = [
    {
      title: 'Product',
      key: 'product',
      dataIndex: 'product',
      render: (product) => product[0]?.name || 'Unknown',
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      dataIndex: 'totalPrice',
      align: 'start',
      render: (totalPrice: any) => (
        <div style={{ whiteSpace: 'nowrap', fontSize: '14px' }}>{totalPrice}</div>
      ),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'start',
    },
    {
      title: 'Chemicals',
      key: 'chemicals',
      dataIndex: 'chemicals',
      align: 'start',
      render: (chemicals: string) => (
        <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>{chemicals ? chemicals : 'Unknown' }</div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => {
        if (status === 'pending') return <Tag className='capitalize' color='orange'>{status}</Tag>;
        if (status === 'acknowledged') return <Tag className='capitalize' color='blue'>{status}</Tag>;
        if (status === 'ready') return <Tag className='capitalize' color='green'>{status}</Tag>;
        if (status === 'completed') return <Tag className='capitalize' color='green'>{status}</Tag>;
        return <Tag>{status}</Tag>;
      },
    },
   
    {
      title: 'Acknowledged',
      key: 'acknowledgedBy',
      dataIndex: 'acknowledgedBy',
      align: 'center',
      render: (acknowledgedBy) => {
        if (!acknowledgedBy) return <div>-</div>;
        return <Tag>{acknowledgedBy}</Tag>;
      },
    },
    {
      title: 'Ready',
      key: 'readyBy',
      dataIndex: 'readyBy',
      align: 'center',
      render: (readyBy) => {
        if (!readyBy) return  <div>-</div>;
        return <Tag>{readyBy}</Tag>;
      },
    },
    {
      title: 'Created',
      key: 'createdAt',
      dataIndex: 'createdAt',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        if (usersRole === 'Manager') {return ( 
          <div className='flex items-center gap-1'>
        <CompletedModal order={item} />
        <ViewOrderDetails order={item} />
        <DeleteProductModal id={item.key} />
        </div>
      )}
        if (usersRole === 'Stock-Manager') {return ( 
          <div className='flex items-center gap-1'>
        <AcknowledgedModal order={item} />
        <ViewOrderDetails order={item} />
        </div>
      )}
        if (usersRole === 'Mixture') {return ( 
          <div className='flex items-center gap-1'>
        <ReadyModal order={item} />
        <ViewOrderDetails order={item} />
        </div>
      )}
        return;
             
      },
      width: '1%',
    },
  ];

  const columns2: TableColumnsType<IOrder & { key: string }> = [
    {
      title: 'Product',
      key: 'product',
      dataIndex: 'product',
      render: (product) => product[0]?.name || 'Unknown',
    },
    {
      title: 'Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'start',
    },
    {
      title: 'Chemicals',
      key: 'chemicals',
      dataIndex: 'chemicals',
      align: 'start',
      render: (chemicals: string) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{chemicals ? chemicals : 'Unknown'}</div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => {
        if (status === 'pending') return <Tag className='capitalize' color='orange'>{status}</Tag>;
        if (status === 'acknowledged') return <Tag className='capitalize' color='blue'>{status}</Tag>;
        if (status === 'ready') return <Tag className='capitalize' color='green'>{status}</Tag>;
        if (status === 'completed') return <Tag className='capitalize' color='green'>{status}</Tag>;
        return <Tag>{status}</Tag>;
      },
    },
   
    {
      title: 'Acknowledged By',
      key: 'acknowledgedBy',
      dataIndex: 'acknowledgedBy',
      align: 'center',
      render: (acknowledgedBy) => {
        if (!acknowledgedBy) return <div>-</div>;
        return <Tag>{acknowledgedBy}</Tag>;
      },
    },
    {
      title: 'Ready By',
      key: 'readyBy',
      dataIndex: 'readyBy',
      align: 'center',
      render: (readyBy) => {
        if (!readyBy) return <div>-</div>;
        return <Tag>{readyBy}</Tag>;
      },
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        if (usersRole === 'Manager') {return ( 
          <div className='flex items-center gap-1'>
        <CompletedModal order={item} />
        <ViewOrderDetails order={item} />
        <DeleteProductModal id={item.key} />
        </div>
      )}
        if (usersRole === 'Stock-Manager') {return ( 
          <div className='flex items-center gap-1'>
        <AcknowledgedModal order={item} />
        <ViewOrderDetails order={item} />
        </div>
      )}
        if (usersRole === 'Mixture') {return ( 
          <div className='flex items-center gap-1'>
        <ReadyModal order={item} />
        <ViewOrderDetails order={item} />
        </div>
      )}
        return;
             
      },
      width: '1%',
    },
  ];


  return (
    <>
      <Flex justify='space-between' align='center' style={{ margin: '5px', paddingBottom: '20px' }}>
        <h2 className='text-white font-bold text-4xl'>Orders Request</h2>
          <SearchInput setQuery={setQuery} placeholder='Search Purchase...' />
        </Flex>
      <Table
        size='small'
        loading={isFetching}
        columns={ (usersRole !== 'Mixture' && usersRole !== 'Stock-Manager')? columns : columns2}
        dataSource={tableData}
        pagination={false}
      />
      <Flex justify='center' style={{ marginTop: '1rem' }}>
      <Pagination
          current={query.page}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={orders?.meta?.total}
        />
      </Flex>
    </>
  );
};


/**
 * Completed Order Modal (for Manager)
 */
const CompletedModal = ({ order }: { order: IOrder & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: userData } = useGetSelfProfileQuery(undefined);

  useEffect(() => {
    if (userData) {
      setUserId(userData.data.name);
    }
  }, [userData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCompleted = async () => {
    try {
      const res = await updateOrder({
        id: order.key,
        payload: { 
          status: 'completed', 
          completedBy: userId, 
          completedAt: new Date().toISOString() 
        },
      }).unwrap();

      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
        // The parent component will automatically refetch due to query state
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data?.message || "Failed to complete order" });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='mr-1 px-2 text-xs bg-green-700 w-fit'
        disabled={order.status !== 'ready'} 
      >
        Mark as Completed
      </Button>
      <Modal
        title='Complete Order'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key='complete' type='primary' onClick={handleCompleted}>
            Complete
          </Button>,
        ]}
      >
        <p>Are you sure you want to mark this order as completed?</p>
      </Modal>
    </>
  );
};

/**
 * Acknowledged Order Modal (for Stock Manager)
 */
const AcknowledgedModal = ({ order }: { order: IOrder & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [updateOrder] = useUpdateOrderMutation();
  const { data: userData } = useGetSelfProfileQuery(undefined);

  useEffect(() => {
    if (userData) {
      setUserId(userData.data.name);
    }
  }, [userData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAcknowledge = async () => {
    if (!userId) {
      toastMessage({ icon: 'error', text: 'User ID is missing.' });
      return;
    }

    try {
      const res = await updateOrder({
        id: order.key,
        payload: { status: 'acknowledged', acknowledgedBy: userId },
      }).unwrap();

      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='mr-1 w-fit'
        style={{ backgroundColor: 'blue' }}
        disabled={order.status !== 'pending'}   
      >
        Acknowledge
      </Button>
      <Modal
        title='Acknowledge Order'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key='acknowledge' type='primary' onClick={handleAcknowledge}>
            Acknowledge
          </Button>,
        ]}
      >
        <p>Are you sure you want to acknowledge this order?</p>
      </Modal>
    </>
  );
};

/**
 * Ready Order Modal (for Mixture)
 */
const ReadyModal = ({ order }: { order: IOrder & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { data: userData } = useGetSelfProfileQuery(undefined);

  useEffect(() => {
    if (userData) {
      setUserId(userData.data.name);
    }
  }, [userData]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReady = async () => {
    try {
      const res = await updateOrder({
        id: order.key,
        payload: { status: 'ready', readyBy: userId, readyDate: new Date() }, 
      }).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='mr-1 w-fit'
        style={{ backgroundColor: 'green' }}
        disabled={order.status !== 'acknowledged'} 
      >
        Mark as Ready
      </Button>
      <Modal
        title='Mark Order as Ready'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key='ready' type='primary' onClick={handleReady}>
            Mark as Ready
          </Button>,
        ]}
      >
        <p>Are you sure you want to mark this order as ready?</p>
      </Modal>
    </>
  );
};

/**
 * View Order Details Modal
 */

const ViewOrderDetails = ({ order }: { order: IOrder & { key: string } }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [UserRole, setUserRole] = useState(undefined);
    const user = useGetSelfProfileQuery(undefined);

  useEffect(()=>{
    setUserRole(user.currentData.data.role)
  },[user])

  const chemicalIds = order.product[0]?.chemicals?.map((chem: any) => chem?.chemicalId) || [];
  const chemicalDetails = useGetChemicalDetails(chemicalIds);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  
  const detailsColumns: TableColumnsType<any> = [
    {
      title: 'Property',
      dataIndex: 'property',
      key: 'property',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const detailsData = [
    { key: '1', property: 'Product Name', value: order.product[0]?.name || 'Unknown'  },
    { key: '2', property: 'Order Quantity', value: order.quantity },
    {
      key: '3',
      property: 'Chemicals:',
      value: (
        <ul>
          {chemicalDetails?.map((chem, index) => (
            <li key={index} className='text-start'>
              {chem?.name} - {`${order.product[0]?.chemicals[index].quantity} Qty`} - {`Rs.${chem?.price}`}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: '4',
      property: 'Total Price',
      value: (UserRole !== 'Mixture' && UserRole !== 'Stock-Manager') ? `${order.totalPrice}` : 'N/A',
    },
    { key: '6', property: 'Status', value: order.status },
    { key: '7', property: 'Additional Information', value: order.additionalMessage },
    { key: '8', property: 'Acknowledged By', value: order.acknowledgedBy || 'Not Acknowledged' },
    { key: '9', property: 'Ready By', value: order.readyBy || 'Not Ready' },
    { key: '10', property: 'Ready At', value: order?.readyDate ? formatDateLocal(order?.readyDate) : 'Not Ready' },
    { key: '11', property: 'Created By', value: order.createdBy || 'Not Available' },

  ];

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        className="px-2 font-semibold bg-gradient-to-r from-blue-500 to-purple-500 w-fit"
      >
        <EyeOutlined />
      </Button>
      <Modal
        title="Order Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className="text-white"
      >
        <Table
          columns={detailsColumns}
          dataSource={detailsData}
          pagination={false}
          size="small"
          bordered
        />
      </Modal>
    </>
  );
};

// Delete Model


const DeleteProductModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProduct] = useDeleteOrderMutation();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteProduct(id).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        className="table-btn-small"
        style={{ backgroundColor: 'red' }}
      >
        <DeleteFilled />
      </Button>
      <Modal title="Delete Product" open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Are you sure you want to delete this product?</h2>
          <h4>You won't be able to revert it.</h4>
          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}
          >
            <Button
              onClick={handleCancel}
              type="primary"
              style={{ backgroundColor: 'lightseagreen' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(id)}
              type="primary"
              style={{ backgroundColor: 'red' }}
            >
              Yes! Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OrdersRequestPage;