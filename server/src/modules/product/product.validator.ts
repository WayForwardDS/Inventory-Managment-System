import { z } from 'zod';

const chemicalSchema = z.object({
  chemicalId: z.string().min(1, { message: 'Chemical ID is required' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
});

const createSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  price: z.number().min(1, { message: 'Price must be greater than 0' }),
  chemicals: z.array(chemicalSchema).min(1, { message: 'At least one chemical is required' }),
});

const updateSchema = z.object({
  name: z.string().optional(),
  price: z.number().min(1, { message: 'Price must be greater than 0' }).optional(),
  chemicals: z.array(chemicalSchema).optional(),
});

const addStockSchema = z.object({
  stock: z.number().min(1, { message: 'Must be greater than 1!' }),
});

const productValidator = { createSchema, updateSchema, addStockSchema };
export default productValidator;