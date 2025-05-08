import { FieldValues, useForm } from 'react-hook-form';
import CustomInput from '../components/CustomInput';
import toastMessage from '../lib/toastMessage';
import { useGetAllProductsQuery } from '../redux/features/management/productApi';
import { useCreateNewOrderMutation } from '../redux/features/management/orderApi';
import { IProduct } from '../types/product.types';
import CustomTextArea from '../components/CustomTextArea';
import { useState, useEffect } from 'react';
import { Types } from 'mongoose';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useGetSelfProfileQuery } from '../redux/features/authApi';

const CreateNewOrder = () => {
  const [createNewOrder] = useCreateNewOrderMutation();
  const [userCreated, setUserCreated] = useState<string | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const { data: userData } = useGetSelfProfileQuery(undefined);

  const [query] = useState({
    name: '',
    price: '',
    chemicals: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const { data: products } = useGetAllProductsQuery(query);

  const tableData = products?.data?.map((product: IProduct) => ({
    _id: product._id,
    name: product.name,
    price: product.price,
    chemicals: product.chemicals,
  }));

  const selectedProductId = watch('product');

  useEffect(() => {
    if (selectedProductId) {
      const selectedProduct = tableData?.find((product: IProduct) => product._id === selectedProductId);
      if (selectedProduct) {
        setValue('name', selectedProduct.name);
      }
    }
  }, [selectedProductId, tableData, setValue]);

  useEffect(() => {
    if (userData) {
      setUserCreated(userData.data.name);
    }
  }, [userData]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity) && selectedProductId) {
      const selectedProduct = tableData?.find((product: IProduct) => product._id === selectedProductId);
      if (selectedProduct) {
        setTotalPrice(quantity * selectedProduct?.price);
      }
    }
  };

  const defaultChemicals = [
    { _id: new Types.ObjectId().toHexString(), name: 'Chemical 1', price: 10, stock: 100 },
  ];

  const onSubmit = async (data: FieldValues) => {
    if (!data.product || !data.quantity) {
      toastMessage({ icon: 'error', text: 'Please fill all required fields' });
      return;
    }

    const selectedProduct = tableData?.find((product: IProduct) => product._id === data.product);
    if (!selectedProduct) {
      toastMessage({ icon: 'error', text: 'Selected product not found' });
      return;
    }

    const createdBy = userCreated;
    const payload = {
      product: data.product,
      quantity: Number(data.quantity),
      additionalMessage: data.additionalMessage,
      chemicals: defaultChemicals.map((chemical) => ({
        chemical: chemical._id,
        quantity: 1,
      })),
      totalPrice: totalPrice,
      createdBy,
      acknowledgedBy: '',
      readyBy: '',
      completedBy: '',
      status: 'pending',
    };

    try {
      const res = await createNewOrder(payload).unwrap();
      if (res.statusCode === 201) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        toastMessage({ icon: 'success', text: res.message });
        reset();
      }
    } catch (error: any) {
      console.log(error);
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      {submitted && <Confetti numberOfPieces={300} recycle={false} />}

      {/* Animated Background Elements */}
      <div className="absolute bg-blue-500 rounded-full w-80 h-80 opacity-40 blur-3xl top-10 left-20 animate-pulse"></div>
      <div className="absolute bg-purple-500 rounded-full w-72 h-72 opacity-40 blur-3xl bottom-10 right-20 animate-bounce"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl p-10 bg-white border shadow-2xl bg-opacity-10 backdrop-blur-lg border-white/20 rounded-3xl"
      >
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl mb-10 font-bold tracking-wide text-center text-white uppercase"
        >
          Create New Order
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="flex gap-12">
              <label className="block text-lg font-semibold whitespace-nowrap">Select Product</label>
              <select
                {...register('product', { required: true })}
                className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400  " + `${errors.product ? 'input-field-error' : ''}`}
              >
                <option value="">Select Product*</option>
                {tableData?.map((item: IProduct) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <CustomInput 
              onChange={handleQuantityChange}
              errors={errors}
              label="Quantity"
              type="number"
              name="quantity"
              register={register}
              required={true}
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <CustomTextArea
              label="Additional Information"
              name="additionalMessage"
              register={register}
              errors={errors}
              className="w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </motion.div>

          {/* Total Price Display */}
          <div className="w-full max-w-[75%] ml-auto p-4 bg-gray-800 rounded-lg">
            <h4 className="text-lg font-semibold">Total Price</h4>
            <p className="text-xl font-bold">Rs. <span className='text-xl text-green-600'>{totalPrice.toFixed(0)}</span></p>
          </div>

          <div className="w-full flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="w-64 px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
            >
              Create Order
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateNewOrder;
