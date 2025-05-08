import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useCreateNewProductMutation } from '../redux/features/management/productApi';
import { IChemical } from '../types/chemical.type';
import { useNavigate } from 'react-router-dom';
import { useGetAllChemicalsQuery } from '../redux/features/management/chemicalApi';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useState, useEffect, useCallback } from 'react';
import toastMessage from '../lib/toastMessage';

interface IProductFormData {
  name: string;
  price: number;
  chemicals: {
    chemicalId: string;
    quantity: number;
    pricePerUnit?: number;
  }[];
}

const CreateProduct = () => {
  const [createNewProduct] = useCreateNewProductMutation();
  const { data: chemicals } = useGetAllChemicalsQuery(undefined);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IProductFormData>({
    defaultValues: {
      name: '',
      price: 0,
      chemicals: [{ chemicalId: '', quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chemicals',
    rules: { minLength: 1 },
  });

  const watchedChemicals = watch('chemicals');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [usedChemicalIds, setUsedChemicalIds] = useState<Set<string>>(new Set());


  // Memoized calculation function
  const calculateTotal = useCallback(() => {
    let total = 0;
    watchedChemicals?.forEach((chem) => {
      if (chem.chemicalId && chem.quantity) {
        const selectedChemical = chemicals?.data.find(
          (c: IChemical) => c._id === chem.chemicalId
        );
        if (selectedChemical) {
          const pricePerUnit = selectedChemical.price / selectedChemical.quantity;
          total += chem.quantity * pricePerUnit;
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

  // Watch for changes and recalculate
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
    
    // Update price per unit if chemical is selected
    const chemicalId = watchedChemicals[index]?.chemicalId;
    if (chemicalId) {
      const selectedChemical = chemicals?.data.find(
        (c: IChemical) => c._id === chemicalId
      );
      if (selectedChemical) {
        setValue(
          `chemicals.${index}.pricePerUnit`,
          selectedChemical.price / selectedChemical.quantity
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
      const selectedChemical = chemicals?.data.find(
        (c: IChemical) => c._id === chemicalId
      );
      if (selectedChemical) {
        const pricePerUnit = selectedChemical.price / selectedChemical.quantity;
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
      const res = await createNewProduct(payload).unwrap();
      if (res.statusCode === 201) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        toastMessage({ icon: 'success', text: res.message });
        reset();
        navigate('/products');
      }
    } catch (error: any) {
      console.error(error);
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
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
          Add Product
        </motion.h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-lg font-semibold">Product Name</label>
            <input
              {...register('name', { required: 'Product name is required' })}
              className={`input-field w-full px-4 !py-2.5 h-auto text-white bg-gray-800 border ${
                errors.name ? 'border-red-500' : '!border-gray-600'
              } rounded-lg focus:ring-2 focus:ring-blue-400`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </motion.div>

          <div className="w-full">
            <h4 className="block text-lg font-semibold">Add Chemicals</h4>
            {fields.map((field, index) => {
              const selectedChemical = chemicals?.data.find(
                (c: IChemical) => c._id === watchedChemicals[index]?.chemicalId
              );
              const itemPrice = selectedChemical
                ? (watchedChemicals[index]?.quantity || 0) * 
                  (selectedChemical.price / selectedChemical.quantity)
                : 0;

              return (
                <div key={field.id} className="flex flex-col w-full gap-1 mb-2 p-2 bg-gray-800/50 rounded-lg">
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
                            className={`w-full px-4 py-2 text-white bg-gray-800 border ${
                              errors.chemicals?.[index]?.chemicalId ? 'border-red-500' : 'border-gray-700'
                            } rounded-lg focus:ring-2 focus:ring-blue-400`}
                          >
                            <option value="">Select Chemical</option>
                            {chemicals?.data.map((chemical: IChemical) => (
                              <option key={chemical._id} value={chemical._id}>
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
                          className={`w-20 px-4 py-2 text-white bg-gray-800 border ${
                            errors.chemicals?.[index]?.quantity ? 'border-red-500' : 'border-gray-700'
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
                    <div className="flex justify-between text-sm text-gray-300">
                      <span className='text-xs'>
                        Unit Price: Rs. {(selectedChemical.price / selectedChemical.quantity).toFixed(2)}
                      </span>
                      <span className="font-medium text-xs">
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
              className="flex items-center gap-2 px-4 py-2 mt-2 text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
              <span>+</span>
              <span>Add Chemical</span>
            </button>
          </div>

          <div className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Total Product Price</h4>
              <p className="text-2xl font-bold text-green-500">
                Rs. {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full px-6 py-3 text-lg font-bold text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:-translate-y-1"
          >
            Add Product
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProduct;

