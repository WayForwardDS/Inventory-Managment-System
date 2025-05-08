import { FieldValues, useForm } from 'react-hook-form';
import { useCreateNewChemicalMutation } from '../redux/features/management/chemicalApi';
import { useNavigate } from 'react-router-dom';
import toastMessage from '../lib/toastMessage';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useState } from 'react';

const AddNewChemical = () => {
  const [createNewChemical] = useCreateNewChemicalMutation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const payload = {
      name: data.name.trim(),
      price: Number(data.price),
      quantity: Number(data.quantity),
      type: data.type,
      min_qty: Number(data.min_qty),
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await createNewChemical(payload).unwrap();
      if (res.statusCode === 201) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000); 
        toastMessage({ icon: 'success', text: res.message });
        reset();
        navigate('/manage-chemicals');
      }
    } catch (error: any) {
      console.error(error);
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl">
      {submitted && <Confetti numberOfPieces={300} recycle={false} />}

      <div className="absolute bg-blue-500 rounded-full w-80 h-80 opacity-40 blur-3xl top-10 left-20 animate-pulse"></div>
      <div className="absolute bg-purple-500 rounded-full w-72 h-72 opacity-40 blur-3xl bottom-10 right-20 animate-bounce"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg p-10 bg-white border shadow-2xl bg-opacity-10 backdrop-blur-lg border-white/20 rounded-3xl"
      >
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold tracking-wide text-center text-white uppercase"
        >
          Add New Chemical
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Chemical Name */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-lg font-semibold">Chemical Name</label>
            <input 
              {...register('name', { required: true })} 
              className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 " + `${errors.name ? 'input-field-error' : ''}`} 
              placeholder="Enter chemical name" 
            />
          </motion.div>
          {/* Price */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <label className="block text-lg font-semibold">Price ($)</label>
            <input 
              type="number" 
              {...register('price', { required: true })} 
              className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 "+ `${errors.price ? 'input-field-error' : ''}`} 
              placeholder="Enter price" 
            />
          </motion.div>

          {/* Stock Quantity */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <label className="block text-lg font-semibold">Stock Quantity</label>
            <input 
              type="number" 
              {...register('quantity', { required: true })} 
              className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 " + `${errors.quantity ? 'input-field-error' : ''}`} 
              placeholder="Enter quantity" 
            />
          </motion.div>

          {/* Type */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <label className="block text-lg font-semibold">Type</label>
            <select 
              {...register('type', { required: true })} 
              className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 " +  `${errors.type ? 'input-field-error' : ''}`}
            >
              <option value="">Select Type</option>
              <option value="gm">gm</option>
              <option value="ml">ml</option>
              <option value="mm">mm</option>
            </select>
          </motion.div>

          {/* Alert Stock Quantity */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <label className="block text-lg font-semibold">Alert Stock Quantity</label>
            <input 
              type="number" 
              {...register('min_qty', { required: true })} 
              className={"input-field !mb-0 w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 " + `${errors.min_qty ? 'input-field-error' : ''}`} 
              placeholder="Enter alert stock quantity" 
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
          >
            Add Chemical
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewChemical;