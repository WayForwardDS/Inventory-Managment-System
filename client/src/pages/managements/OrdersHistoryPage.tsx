import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useGetAllOrdersQuery } from '../../redux/features/management/orderApi';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import formatDateLocal from '../../utils/formatDateLocal';
import { useGetChemicalDetails } from '../../hooks/useGetChemicalsDetails';
import Papa from 'papaparse';
import { useGetSelfProfileQuery } from '../../redux/features/authApi';
import SearchInput from '../../components/SearchInput';
import { useGetAllChemicalsQuery } from '../../redux/features/management/chemicalApi';

const OrdersHistoryPage = () => {
  const [query, setQuery] = useState({
    status: 'completed',
    page: 1,
    limit: 20,
  });

  const { data: orders, isFetching } = useGetAllOrdersQuery(query);
  const [UserRole, setUserRole] = useState(undefined);
  const user = useGetSelfProfileQuery(undefined);
  const { data: chemicals } = useGetAllChemicalsQuery({});


  useEffect(()=>{
    setUserRole(user.currentData.data.role)
  },[user])

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page: page }));
    };



    const tableData = orders?.data
    ? orders.data
        .filter((order: any) => order.status === 'completed')
        .map((order: any) => {
          let formattedReadyAt = 'N/A';
          
          if (order.readyDate) {
            try {
              const readyDate = new Date(order.readyDate);
              
              if (!isNaN(readyDate.getTime())) {
                const day = readyDate.getDate();
                const month = readyDate.getMonth() + 1;
                const year = readyDate.getFullYear();
                const hours = readyDate.getHours().toString().padStart(2, '0');
                const minutes = readyDate.getMinutes().toString().padStart(2, '0');
                
                formattedReadyAt = `${month}/${day}/${year} ${hours}:${minutes}`;
              } else {
                console.warn('Invalid readyDate:', order.readyDate);
                formattedReadyAt = 'Invalid Date';
              }
            } catch (e) {
              console.error('Error parsing readyDate:', e);
              formattedReadyAt = 'Invalid Date';
            }
          }
  
          return {
            key: order._id,
            product: order.product,
            totalPrice: order.totalPrice,
            quantity: order.quantity,
            status: order.status,
            additionalMessage: order.additionalMessage,
            createdBy: order.createdBy,
            acknowledgedBy: order.acknowledgedBy,
            readyBy: order.readyBy,
            readyDate: formattedReadyAt, 
            completedBy: order.completedBy,
            completedAt: order.completedAt,
            createdAt: order.createdAt,
          };
        })
    : [];

  const columns: TableColumnsType<any> = [
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
      align: 'center',
      render: (price: number) => <span className="text-black">Rs.{price.toFixed(0)}</span>,
    },
    {
      title: 'Total Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
      render: (quantity: number) => <span className="text-black">{quantity}</span>,
    },

    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => {
        return <Tag color="green">{status}</Tag>;
      },
    },
    {
      title: 'Acknowledged',
      key: 'acknowledgedBy',
      dataIndex: 'acknowledgedBy',
      align: 'center',
      render: (acknowledgedBy: string) => <span className="text-black">{acknowledgedBy}</span>,
    },
    {
      title: 'Ready',
      key: 'readyBy',
      dataIndex: 'readyBy',
      align: 'center',
      render: (readyBy: string) => <span className="text-black">{readyBy}</span>,
    },
    {
      title: 'Completed',
      key: 'completedBy',
      dataIndex: 'completedBy',
      align: 'center',
      render: (completedBy: string) => <span className="text-black">{completedBy}</span>,
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => (
        <div style={{ display: 'flex' }}>
          <DownloadPDF order={item} />
          <ViewOrderDetails order={item} />
        </div>
      ),
      width: '1%',
    },
  ];

  const columns2: TableColumnsType<any> = [
    {
      title: 'Product',
      key: 'product',
      dataIndex: 'product',
      render: (product) => product[0]?.name || 'Unknown',
    },
    {
      title: 'Total Quantity',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
      render: (quantity: number) => <span className="text-black">{quantity}</span>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => {
        return <Tag color="green">{status}</Tag>;
      },
    },
    {
      title: 'Acknowledged',
      key: 'acknowledgedBy',
      dataIndex: 'acknowledgedBy',
      align: 'center',
      render: (acknowledgedBy: string) => <span className="text-black">{acknowledgedBy}</span>,
    },
    {
      title: 'Ready',
      key: 'readyBy',
      dataIndex: 'readyBy',
      align: 'center',
      render: (readyBy: string) => <span className="text-black">{readyBy}</span>,
    },
    {
      title: 'Completed',
      key: 'completedBy',
      dataIndex: 'completedBy',
      align: 'center',
      render: (completedBy: string) => <span className="text-black">{completedBy}</span>,
    },
    {
      title: 'Ready Date',
      key: 'readyDate',
      dataIndex: 'readyDate',
      align: 'center',
      render: (readyDate: string) => <span className="text-black">{readyDate}</span>,
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => (
        <div style={{ display: 'flex' }}>
          <DownloadPDF order={item} />
          <ViewOrderDetails order={item} />
        </div>
      ),
      width: '1%',
    },
  ];

   // Handle Download CSV
   const handleDownloadCSV = () => {
    if (!tableData || tableData.length === 0) return;
  
    // Create a proper Map from chemicals data
    const chemicalsMap = new Map(
      chemicals?.data?.map(chem => [chem._id, chem]) || []
    );
  
    const csvData = tableData.map((item: any) => {
      // Format date
      let formattedReadyAt = '-';
      if (item.readyDate) {
        const readyDate = new Date(item.readyDate);
        if (!isNaN(readyDate.getTime())) {
          formattedReadyAt = `${readyDate.getMonth() + 1}/${readyDate.getDate()}/${readyDate.getFullYear()}`;
        }
      }
  
      let chemicalsList = 'N/A';
      if (item.product?.[0]?.chemicals) {
        chemicalsList = item.product[0].chemicals
          .filter(chem => chem?.chemicalId) 
          .map(chem => {
            const chemDetail = chemicalsMap.get(chem.chemicalId);
            return {
              name: chemDetail?.name || `Unknown (ID: ${chem.chemicalId})`,
              quantity: chem?.quantity || 0,
              price: chemDetail?.price || 0
            };
          })
          .map(chem => `${chem.name} - ${chem.quantity} Qty - Rs.${chem.price.toFixed(2)}`)
          .join('; ');
      }
  console.log(chemicalsList)
      return {
        'Product Name': item.product?.[0]?.name || 'Unknown',
        'Total Price': `Rs.${item.totalPrice?.toFixed(0) || '0'}`,
        'Quantity': item.quantity || 'N/A',
        'Chemicals': chemicalsList,
        'Status': item.status || 'N/A',
        'Additional Message': item.additionalMessage || 'N/A',
        'Created By': item.createdBy || 'N/A',
        'Acknowledged By': item.acknowledgedBy || 'N/A',
        'Ready By': item.readyBy || 'N/A',
        'Ready Date': formattedReadyAt,
        'Completed By': item.completedBy || 'N/A',
        'Completed At': item.completedAt ? formatDateLocal(item.completedAt) : 'N/A',
        'Created At': item.createdAt ? formatDateLocal(item.createdAt) : 'N/A'
      };
    });
  
    // Rest of your CSV generation code...
    const csv = Papa.unparse(csvData, {
      header: true,
      delimiter: ",",
      newline: "\r\n"
    });
  
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="relative min-h-screen p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl p-6 bg-white border shadow-2xl mx-auto bg-opacity-10 backdrop-blur-lg border-white/20 rounded-3xl"
      >
        <div className="w-full flex items-center justify-between mb-6">
        <SearchInput setQuery={setQuery} placeholder='Search Purchase...' />

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold tracking-wide text-center text-white uppercase"
        >
          Orders History
        </motion.h1>


        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-6 py-6 text-lg font-bold text-white transition-all rounded-lg shadow-lg hover:text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
          >
            Download CSV
          </Button>
        </div>
    

        <Table
          size="small"
          loading={isFetching}
          columns={(UserRole !== 'Mixture' && UserRole !== 'Stock-Manager')? columns : columns2}
          dataSource={tableData}
          pagination={false}
          className="custom-table"
          rowClassName={() => 'custom-table-row'}
        />
        <Flex justify="center" style={{ marginTop: '1rem' }}>
          <Pagination
            current={query.page}
            onChange={onChange}
            defaultPageSize={query.limit}
            total={orders?.meta?.total}
            className="text-white"
          />
        </Flex>
      </motion.div>
    </div>
  );
};

/**
 * Download PDF Component for Order
 */
const DownloadPDF = ({ order }: { order: any }) => {
  const chemicalIds = order.product[0]?.chemicals?.map((chem: any) => chem?.chemicalId) || [];
  const chemicalDetails = useGetChemicalDetails(chemicalIds);

  const handleDownloadPDF = () => {
    const formatDate = (dateString: string) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Invalid Date' : formatDateLocal(dateString);
    };

    // Create PDF
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('ORDER DETAILS', 105, 20, { align: 'center' });

    // Add border
    doc.setDrawColor(0);
    doc.rect(5, 5, doc.internal.pageSize.getWidth() - 10, doc.internal.pageSize.getHeight() - 10);

    // Order Information
    doc.setFontSize(12);
    let yPos = 30;

    // Product Section
    doc.setFont('helvetica', 'bold');
    doc.text('Product Information:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(`• Name: ${order.product[0]?.name || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Total Price: Rs.${order.totalPrice?.toFixed(0) || '0'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Quantity: ${order.quantity || 'N/A'}`, 20, yPos);
    yPos += 10;

    // Chemicals Section
    doc.setFont('helvetica', 'bold');
    doc.text('Chemicals Information:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;

    if (chemicalDetails && chemicalDetails.length > 0) {
      chemicalDetails.forEach((chem: any, index: number) => {
        const orderChem = order.product[0]?.chemicals?.[index];
        const chemName = chem?.name || 'Unknown Chemical';
        const quantity = orderChem?.quantity ? `${orderChem.quantity}` : 'Quantity N/A';
        const price = chem?.price ? `Rs.${chem.price.toFixed(2)}` : 'Price N/A';

        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        const chemicalLine = `• ${chemName}, Quantity: ${quantity}, Price: ${price}`;
        doc.text(chemicalLine, 20, yPos);
        yPos += 7;
      });
    } else {
      doc.text('• No chemicals information available', 20, yPos);
      yPos += 7;
    }
    yPos += 10;

    // Status Section
    doc.setFont('helvetica', 'bold');
    doc.text('Status Information:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(`• Current Status: ${order.status || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Additional Message: ${order.additionalMessage || 'None'}`, 20, yPos);
    yPos += 10;

    // Personnel Section
    doc.setFont('helvetica', 'bold');
    doc.text('Personnel:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(`• Created By: ${order.createdBy || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Acknowledged By: ${order.acknowledgedBy || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Ready By: ${order.readyDate || 'N/A'}`, 20, yPos);
    yPos += 7;
    doc.text(`• Completed By: ${order.completedBy || 'N/A'}`, 20, yPos);
    yPos += 10;

    // Timeline Section
    doc.setFont('helvetica', 'bold');
    doc.text('Timeline:', 15, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
    doc.text(`• Created At: ${formatDate(order.createdAt)}`, 20, yPos);
    yPos += 7;
    doc.text(`• Ready Date: ${formatDate(order.readyDate)}`, 20, yPos);
    yPos += 7;
    doc.text(`• Completed At: ${formatDate(order.completedAt)}`, 20, yPos);
    yPos += 10;

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    doc.text('Contact: support@company.com | Phone: +1 (123) 456-7890', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`order_${order._id || order.product[0]?.name || 'details'}.pdf`);
  };

  return (
    <Button
      onClick={handleDownloadPDF}
      type="primary"
      className="mr-1 w-fit"
      style={{ backgroundColor: 'red' }}
    >
      Download PDF
    </Button>
  );
};

/**
 * View Order Details Modal
 */
const ViewOrderDetails = ({ order }: { order: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [UserRole, setUserRole] = useState(undefined);
  const user = useGetSelfProfileQuery(undefined);

  useEffect(() => {
    if (user.currentData?.data?.role) {
      setUserRole(user.currentData.data.role);
    }
  }, [user]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Safely get chemical IDs with fallback for undefined cases
  const chemicalIds = order.product[0]?.chemicals?.map((chem: any) => chem?.chemicalId) || [];
  const chemicalDetails = useGetChemicalDetails(chemicalIds);

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

  // Function to render chemicals with error handling
  const renderChemicals = () => {
    if (!chemicalDetails || chemicalDetails.length === 0) {
      return 'No chemicals information available';
    }

    return (
      <ul>
        {chemicalDetails.map((chem, index) => {
          // Get the corresponding order chemical info
          const orderChem = order.product[0]?.chemicals?.[index];
          
          // Fallback values if data is missing
          const chemName = chem?.name || 'Unknown Chemical';
          const quantity = orderChem?.quantity ? `${orderChem.quantity} Qty` : 'Quantity N/A';
          const price = chem?.price ? `Rs.${chem.price}` : 'Price N/A';

          return (
            <li key={index} className='text-start'>
              {chemName} - {quantity} - {price}
            </li>
          );
        })}
      </ul>
    );
  };

  const detailsData = [
    { key: '1', property: 'Product Name', value: order.product[0]?.name || 'N/A' },
    { 
      key: '2', 
      property: 'Total Price',
      value: (UserRole !== 'Mixture' && UserRole !== 'Stock-Manager') 
        ? `Rs.${order.totalPrice?.toFixed(0) || '0'}` 
        : 'N/A' 
    },
    { key: '3', property: 'Status', value: order.status || 'N/A' },
    { key: '4', property: 'Additional Information', value: order.additionalMessage || 'N/A' },
    {
      key: '5',
      property: 'Chemicals:',
      value: renderChemicals(),
    },
    { key: '6', property: 'Acknowledged By', value: order.acknowledgedBy || 'N/A' },
    { key: '7', property: 'Ready By', value: order.readyBy || 'N/A' },
    { key: '8', property: 'Completed By', value: order.completedBy || 'N/A' },
    { key: '9', property: 'Ready At', value: order.readyDate ? formatDateLocal(order.readyDate) : 'N/A' },
    { key: '10', property: 'Created At', value: formatDateLocal(order.createdAt) },
    { key: '11', property: 'Completed At', value: order.completedAt ? formatDateLocal(order.completedAt) : 'N/A' },
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

export default OrdersHistoryPage;
