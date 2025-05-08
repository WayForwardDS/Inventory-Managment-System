import { DeleteFilled, DownloadOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import type { PaginationProps, TableColumnsType } from 'antd';
import { Button, Flex, Modal, Pagination, Space, Table } from 'antd';
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from '../../redux/features/management/productApi';
import toastMessage from '../../lib/toastMessage';
import { IProduct } from '../../types/product.types';
import { Link } from 'react-router-dom';
import { useGetAllChemicalsQuery } from '../../redux/features/management/chemicalApi';
import Papa from 'papaparse';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { IChemical } from '../../types/chemical.type';

const ProductManagePage = () => {
  const [query, setQuery] = useState({
    name: '',
    chemicals: '',
    limit: 10,
    page: 1,

  });

  const { data: products, isFetching } = useGetAllProductsQuery(query);
  const { data: chemicals} = useGetAllChemicalsQuery({});

  const onChange: PaginationProps['onChange'] = (page) => {
     setQuery((prev) => ({ ...prev, page: page }));
     };


  const tableData = useMemo(() => {
    if (!products?.data || !chemicals?.data) return [];
  
    const chemicalsMap = new Map(
      chemicals.data.map((chemical:any) => [chemical._id, chemical])
    );
  
    return products.data.map((product:IProduct) => {
      const createdAtDate = new Date(product.createdAt);
      const formattedCreatedAt = `${
        createdAtDate.getMonth() + 1
      }/${createdAtDate.getDate()}/${createdAtDate.getFullYear()}`;
  
      // Handle chemicals array
      let chemicalsDisplay = 'N/A';
      if (product.chemicals) {
        chemicalsDisplay = product.chemicals
          .map((chem:any, index:number) => {
            const chemicalDetails = chemicalsMap.get(chem.chemicalId);
            return `${chemicalDetails?.name} (${chem.quantity} Qty)` + 
                   (index % 2 === 1 ? '\n' : ''); 
          })
          .join(', ') 
          .trim();
      }
  
      return {
        key: product._id,
        name: product.name,
        chemicals: chemicalsDisplay,
        price: `Rs.${product.price.toFixed(0)}`, 
        createdAt: formattedCreatedAt,
      };
    });
  }, [products, chemicals]);


 // Handle Download CSV
 const handleDownloadCSV = () => {
  if (!tableData) return;

  const filteredData = tableData.map((item: any) => ({
    name: item.name,
    chemicals: item.chemicals,
    price: item.price,
    createdAt: item.createdAt,
  }));

  const csv = Papa.unparse(filteredData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'products.csv';
  link.click();
};



  const columns: TableColumnsType<any> = [
    {
      title: 'Product Name',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Chemicals',
      key: 'chemicals',
      dataIndex: 'chemicals',
      render: (chemicals: string) => (
        <div style={{ whiteSpace: 'pre-wrap' }}>{chemicals}</div>
      ),
    },
    {
      title: 'Total Price',
      key: 'price',
      dataIndex: 'price',
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
        <h1 className="text-4xl font-bold text-white">Manage Products</h1>
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
            to="/create-product"
            type="primary"
            className="flex items-center gap-2 px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg hover:text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
            style={{ backgroundColor: 'green' }}
          >
            <PlusOutlined />
            Add New Product
          </Link>
        </Space>
      </div>

      <Table
        size="small"
        loading={isFetching}
        columns={columns}
        dataSource={tableData}
        pagination={false}
      />
      <Flex justify="center" style={{ marginTop: '1rem' }}>
      <Pagination
          current={query.page}
          onChange={onChange}
          defaultPageSize={query.limit}
          total={products?.meta?.total}
        />
      </Flex>
    </>
  );
};

/**
 * Update Product Modal
 */
const UpdateProductModal = ({ product }: { product: IProduct & { key: string } }) => {
  const [updateProduct] = useUpdateProductMutation();
  const { data: chemicals } = useGetAllChemicalsQuery(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface IChemicalItem {
    chemicalId: string;
    quantity: number;
    pricePerUnit?: number;
  }

  interface IProductFormData {
    name: string;
    price: number;
    chemicals: IChemicalItem[];
  }

  // Safely initialize default values
  const getDefaultValues = () => {
    const defaultChemicals = Array.isArray(product?.chemicals) && product.chemicals.length > 0
      ? product.chemicals.map(chem => ({
          chemicalId: chem.chemical?._id || '',
          quantity: chem.quantity || 1,
          pricePerUnit: chem.chemical 
            ? chem.chemical.price / (chem.chemical.quantity || 1) 
            : 0
        }))
      : [{ chemicalId: '', quantity: 1 }];

    return {
      name: product?.name || '',
      price: product?.price || 0,
      chemicals: defaultChemicals
    };
  };

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IProductFormData>({
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chemicals',
    rules: { minLength: 1 },
  });

  const watchedChemicals = watch('chemicals');
  const [totalPrice, setTotalPrice] = useState<number>(product?.price || 0);
  const [usedChemicalIds, setUsedChemicalIds] = useState<Set<string>>(
    new Set(
      Array.isArray(product?.chemicals) 
        ? product.chemicals.map(chem => chem.chemical?._id).filter(Boolean) 
        : []
    )
  );

  const calculateTotal = useCallback(() => {
    let total = 0;
    watchedChemicals?.forEach((chem) => {
      if (chem.chemicalId && chem.quantity) {
        const selectedChemical = chemicals?.data?.find(
          (c: IChemical) => c._id === chem.chemicalId
        );
        if (selectedChemical) {
          const pricePerUnit = selectedChemical.price / (selectedChemical.quantity || 1);
          total += (chem.quantity || 0) * pricePerUnit;
        }
      }
    });
    setTotalPrice(total);
    setValue('price', total);
  }, [watchedChemicals, chemicals, setValue]);

  useEffect(() => {
    const ids = new Set<string>();
    watchedChemicals?.forEach(chem => {
      if (chem.chemicalId) {
        ids.add(chem.chemicalId);
      }
    });
    setUsedChemicalIds(ids);
  }, [watchedChemicals]);

  useEffect(() => {
    calculateTotal();
  }, [watchedChemicals, calculateTotal]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (!name || name.startsWith('chemicals')) {
        calculateTotal();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, calculateTotal]);

  const handleQuantityChange = (index: number, value: number) => {
    const quantity = Math.max(1, isNaN(value) ? 1 : value);
    setValue(`chemicals.${index}.quantity`, quantity);
    
    const chemicalId = watchedChemicals[index]?.chemicalId;
    if (chemicalId) {
      const selectedChemical = chemicals?.data?.find(
        (c: IChemical) => c._id === chemicalId
      );
      if (selectedChemical) {
        setValue(
          `chemicals.${index}.pricePerUnit`,
          selectedChemical.price / (selectedChemical.quantity || 1)
        );
      }
    }
  };

  const handleChemicalChange = (index: number, chemicalId: string) => {
    if (chemicalId && usedChemicalIds.has(chemicalId)) {
      toastMessage({ icon: 'error', text: 'This chemical is already added' });
      return;
    }

    const oldChemicalId = watchedChemicals[index]?.chemicalId;
    if (oldChemicalId) {
      const newUsedIds = new Set(usedChemicalIds);
      newUsedIds.delete(oldChemicalId);
      setUsedChemicalIds(newUsedIds);
    }
    setValue(`chemicals.${index}.chemicalId`, chemicalId);
    if (chemicalId) {
      const selectedChemical = chemicals?.data?.find(
        (c: IChemical) => c._id === chemicalId
      );
      if (selectedChemical) {
        const pricePerUnit = selectedChemical.price / (selectedChemical.quantity || 1);
        setValue(`chemicals.${index}.pricePerUnit`, pricePerUnit);
        const currentQuantity = watchedChemicals[index]?.quantity || 1;
        setValue(`chemicals.${index}.quantity`, Math.max(1, currentQuantity));
      }
    }
  };

  const handleAddChemical = () => {
    append({ chemicalId: '', quantity: 1 });
  };

  const handleRemoveChemical = (index: number) => {
    const chemicalId = watchedChemicals[index]?.chemicalId;
    if (chemicalId) {
      const newUsedIds = new Set(usedChemicalIds);
      newUsedIds.delete(chemicalId);
      setUsedChemicalIds(newUsedIds);
    }
    remove(index);
  };

  const onSubmit = async (data: IProductFormData) => {
    const validChemicals = data.chemicals.filter((chem) => chem.chemicalId);
    
    if (validChemicals.length === 0) {
      toastMessage({ icon: 'error', text: 'Please select at least one chemical' });
      return;
    }

    const payload = {
      name: data.name,
      price: totalPrice,
      chemicals: validChemicals.map((chem) => ({
        chemicalId: chem.chemicalId,
        quantity: chem.quantity,
      })),
    };

    try {
      const res = await updateProduct({ id: product.key, payload }).unwrap();
      if (res.statusCode === 200) {
        toastMessage({ icon: 'success', text: res.message });
        reset();
        handleCancel();
      }
    } catch (error: any) {
      handleCancel();
      toastMessage({ icon: 'error', text: error.data?.message || 'An error occurred' });
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
        type="primary"
        className="table-btn-small"
        style={{ backgroundColor: 'green' }}
      >
        <EditFilled />
      </Button>
      <Modal 
        title="Update Product Info" 
        open={isModalOpen} 
        onCancel={handleCancel} 
        footer={null}
        width={800}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
              <label className="block text-lg font-semibold">Product Name</label>
              <input 
                {...register('name', { required: true })} 
                className={"input-field !mb-0 w-full px-4 py-3 text-gray-800 bg-white border !border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 " + `${errors.name ? 'input-field-error' : ''}`} 
                placeholder="Enter Product name" 
              />
        </div>

          <div className="w-full">
            <h4 className="block text-lg font-semibold">Update Chemicals</h4>
            {fields.map((field, index) => {
              const selectedChemical = chemicals?.data?.find(
                (c: IChemical) => c._id === watchedChemicals[index]?.chemicalId
              );
              const itemPrice = selectedChemical
                ? (watchedChemicals[index]?.quantity || 0) * 
                  (selectedChemical.price / (selectedChemical.quantity || 1))
                : 0;

              return (
                <div key={field.id} className="flex flex-col w-full gap-1 mb-2 p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center w-full gap-2">
                    <div className="relative flex-1">
                      <Controller
                        name={`chemicals.${index}.chemicalId`}
                        control={control}
                        rules={{ required: 'Chemical is required' }}
                        render={({ field }) => (
                          <select
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleChemicalChange(index, e.target.value);
                            }}
                            className={`w-full px-4 py-2 bg-white border ${
                              errors.chemicals?.[index]?.chemicalId ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-blue-400`}
                          >
                            <option value="">Select Chemical</option>
                            {chemicals?.data?.map((chemical: IChemical) => (
                              <option 
                                key={chemical._id} 
                                value={chemical._id}
                                disabled={usedChemicalIds.has(chemical._id) && chemical._id !== watchedChemicals[index]?.chemicalId}
                              >
                                {chemical.name}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    </div>

                    <Controller
                      name={`chemicals.${index}.quantity`}
                      control={control}
                      rules={{
                        required: 'Quantity is required',
                        min: { value: 1, message: 'Minimum quantity is 1' },
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min={1}
                          className={`w-20 px-4 py-2 bg-white border ${
                            errors.chemicals?.[index]?.quantity ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-blue-400`}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10) || 1;
                            field.onChange(value);
                            handleQuantityChange(index, value);
                          }}
                        />
                      )}
                    />

                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveChemical(index)}
                        className="px-1 py-1 -mr-8 ml-1 text-lg font-black text-red-500 hover:text-red-700"
                        aria-label="Remove chemical"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {selectedChemical && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        Unit Price: Rs. {(selectedChemical.price / (selectedChemical.quantity || 1)).toFixed(2)}
                      </span>
                      <span className="font-medium">
                        Item Total: Rs. {itemPrice.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {errors.chemicals?.[index]?.chemicalId && (
                      <p className="text-sm text-red-500">
                        {errors.chemicals[index]?.chemicalId?.message}
                      </p>
                    )}
                    {errors.chemicals?.[index]?.quantity && (
                      <p className="text-sm text-red-500">
                        {errors.chemicals[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={handleAddChemical}
              className="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              <span>+</span>
              <span>Add Chemical</span>
            </button>
          </div>

          <div className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Total Product Price</h4>
              <p className="text-2xl font-bold text-green-600">
              Rs. {typeof totalPrice === 'number' ? totalPrice.toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          <Flex justify="center">
            <Button
              htmlType="submit"
              type="primary"
              style={{ textTransform: 'uppercase', fontWeight: 'bold' }}
            >
              Update Product
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
  const [deleteProduct] = useDeleteProductMutation();

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

export default ProductManagePage;