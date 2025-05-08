import { z } from 'zod';

// Schema for chemicals
const chemicalSchema = z.object({
  chemical: z.string().min(1, { message: 'Chemical ID is required' }), 
  quantity: z.number().min(1, { message: 'Chemical quantity must be at least 1' }), 
});

// Schema for creating an order
const createSchema = z.object({
  product: z.string().min(1, { message: 'Product ID is required' }), 
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }), 
  additionalMessage: z.string().optional(), 
  chemicals: z.array(chemicalSchema).min(1, { message: 'At least one chemical is required' }),
  totalPrice: z.number().min(0, { message: 'Total price must be a positive number' }), 
  status: z.enum(['pending', 'acknowledged', 'ready', 'completed']).optional().default('pending'), 
  createdBy: z.string().optional(),
  completedAt: z.string().optional(),
  acknowledgedBy: z.string().optional(),
  readyBy: z.string().optional(), 
  completedBy: z.string().optional(),
});

// Schema for updating an order
const updateSchema = z.object({
  product: z.string().min(1, { message: 'Product ID is required' }).optional(), 
  quantity: z.number().min(1, { message: 'Quantity must be greater than 0' }).optional(), 
  additionalMessage: z.string().optional(),
  chemicals: z.array(chemicalSchema).min(1, { message: 'At least one chemical is required' }).optional(), 
  totalPrice: z.number().min(0, { message: 'Total price must be a positive number' }).optional(), 
  status: z.enum(['pending', 'acknowledged', 'ready', 'completed']).optional(), 
  acknowledgedBy: z.string().optional(),
  readyBy: z.string().optional(),
  readyDate: z.string().optional(),
  completedBy: z.string().optional(), 
});





const orderValidator = {
  createSchema,
  updateSchema,
};

export default orderValidator;