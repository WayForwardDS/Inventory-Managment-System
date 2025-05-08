import { DeleteFilled, DownloadOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Col, Flex, Modal, Pagination, Row, Space, Table } from 'antd';
import { useState, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import {
  useDeleteChemicalMutation,
  useUpdateChemicalMutation,
} from '../../redux/features/management/chemicalApi';
import { IChemical } from '../../types/chemical.type';
import CustomInput from '../../components/CustomInput';
import toastMessage from '../../lib/toastMessage';
import { Link } from 'react-router-dom';
import { useGetAllChemicalsQuery } from '../../redux/features/management/chemicalApi';
import Papa from 'papaparse';
import { RackCard } from '../../components/warehouse/RackCard';

const ChemicalsManagePage = () => {
  const [query, setQuery] = useState({
    name: '',
    price: '',
    quantity: '',
    type: '',
    limit: 10,
    page: 1
  });

  const { data: chemicals, isFetching } = useGetAllChemicalsQuery(query);

  const onChange: PaginationProps['onChange'] = (page) => {
    setQuery((prev) => ({ ...prev, page: page }));
    };

  const tableData = useMemo(() => {
    return chemicals?.data?.map((product: IChemical) => {
      const createdAtDate = new Date(product.createdAt);
      const formattedCreatedAt = `${
        createdAtDate.getMonth() + 1 
      }/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`;
  
      return {
        key: product._id,
        name: product.name,
        price: `Rs.${product.price.toFixed(0)}`,
        quantity: product.quantity,
        type: product.type,
        createdAt: formattedCreatedAt,
        updatedAt: product.updatedAt,
      };
    });
  }, [chemicals]);

  const perUnitPrice = useMemo(() => {
    return chemicals?.data?.map((product:any) => {
      const fixed = product.price / product.quantity;
      return `Rs.${fixed.toFixed(3)}`;
    });
  }, [chemicals]);



  const handleDownloadCSV = () => {
    if (!tableData) return;

interface TableDataItem {
  name: string;
  price: number;
  quantity: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const filteredData = tableData.map((item: TableDataItem) => ({
  name: item.name,
  price: item.price,
  quantity: item.quantity,
  type: item.type,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
}));

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'chemicals.csv';
    link.click();
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Chemical Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Per Unit',
      key: 'PerUnit',
      dataIndex: 'PerUnit',
      align: 'center',
      render: (_, record, index) => perUnitPrice[index],
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      align: 'center',
    },
    {
      title: 'Total Stock',
      key: 'quantity',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Chemical Unit',
      key: 'type',
      dataIndex: 'type',
      align: 'center',
    },
    {
      title: 'Modified Date',
      key: 'updatedAt',
      dataIndex: 'updatedAt',
      align: 'center',
    },
    { 
      title: 'Created Date',
      key: 'createdAt',
      dataIndex: 'createdAt',
      align: 'center',
    },
    {
      title: 'Action',
      key: 'x',
      align: 'center',
      render: (item) => {
        return (
          <div style={{ display: 'flex' }}>
            <UpdateProductModal product={item} />
            <DeleteProductModal id={item.key} />
          </div>
        );
      },
      width: '1%',
    },
  ];

  return (
    <>
       <div className="flex items-center justify-between w-full my-4 mb-10">
        <h1 className="text-4xl font-bold text-white">Manage Chemicals</h1>
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadCSV}
             className="flex items-center gap-2 px-6 py-6 text-lg font-bold text-white transition-all rounded-lg shadow-lg hover:text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
          >
            Download CSV
          </Button>
          <Link
            to="/add-chemical"
            type="primary"
            className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg hover:text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
            style={{ backgroundColor: 'green' }}
          >
            <PlusOutlined />
            Add New Chemical
          </Link>
        </Space>
      </div>
      <Table
        size='large'
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      />
      <Flex justify='center' style={{ marginTop: '1rem' }}>
        <Pagination
          current={query.page}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={chemicals?.meta?.total}
        />
      </Flex>
    </>
  );
};


/**
 * Update Product Modal
 */
const UpdateProductModal = ({ product }: { product: IChemical & { key: string } }) => {
  const [updateChemical] = useUpdateChemicalMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      type: product.type, 
    },
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await updateChemical({ id: product.key, payload: data }).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={showModal}
        type='primary'
        className='table-btn-small'
        style={{ backgroundColor: 'green' }}
      >
        <EditFilled />
      </Button>
      <Modal title='Update Product Info' open={isModalOpen} onCancel={handleCancel} footer={null}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <CustomInput
            name='name'
            errors={errors}
            label='Name'
            register={register}
            required={true}
            className='bg-white !text-black'
          />

          {/* Price Field */}
          <CustomInput
            errors={errors}
            label='Price'
            type='number'
            name='price'
            register={register}
            required={true}
            className='bg-white !text-black'

          />

          {/* Stock Quantity Field */}
          <CustomInput
            errors={errors}
            label='Stock'
            type='number'
            name='quantity'
            register={register}
            required={true}
            className='bg-white !text-black'

          />

          {/* Chemical Type Field */}
          <Row>
            <Col xs={{ span: 23 }} lg={{ span: 6 }}>
              <label htmlFor='type' className='label'>
                Chemical Type
              </label>
            </Col>
            <Col xs={{ span: 23 }} lg={{ span: 18 }}>
              <select className={`input-field`} {...register('type', { required: true })}>
                <option value=''>Select Chemical Type</option>
                <option value='gm'>GM</option>
                <option value='ml'>ML</option>
                <option value='mm'>MM</option>
              </select>
              {errors.type && (
                <span className='error-message'>Chemical type is required</span>
              )}
            </Col>
          </Row>

          {/* Submit Button */}
          <Flex justify='center'>
            <Button
              htmlType='submit'
              type='primary'
              style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
            >
              Update
            </Button>
          </Flex>
        </form>
      </Modal>
    </>
  );
};


/**
 * Delete Product Modal
 */
const DeleteProductModal = ({ id }: { id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteProduct] = useDeleteChemicalMutation();

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
        type='primary'
        className='table-btn-small'
        style={{ backgroundColor: 'red' }}
      >
        <DeleteFilled />
      </Button>
      <Modal title='Delete Product' open={isModalOpen} onCancel={handleCancel} footer={null}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Are you want to delete this product?</h2>
          <h4>You won't be able to revert it.</h4>
          <div
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}
          >
            <Button
              onClick={handleCancel}
              type='primary'
              style={{ backgroundColor: 'lightseagreen' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete(id)}
              type='primary'
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

export default ChemicalsManagePage;
