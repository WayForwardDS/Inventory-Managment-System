import { z } from 'zod';

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  quantity: z.coerce.number().min(1, "Stock quantity must be at least 1"),
  type: z.string().min(1, "Type is required"),
  min_qty: z.coerce.number().min(0, "Minimum quantity cannot be negative").optional(), 
});

const updateSchema = createSchema.partial();

const addStockSchema = z.object({
  quantity: z.coerce.number().min(1, "Stock must be at least 1"), 
});

const chemicalValidator = { createSchema, updateSchema, addStockSchema };
export default chemicalValidator;