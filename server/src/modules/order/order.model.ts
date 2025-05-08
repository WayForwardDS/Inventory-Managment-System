import { Schema, model } from 'mongoose';
import { IOrder } from './order.interface';

const ORDER_STATUS = {
PENDING: 'pending',
ACKNOWLEDGED: 'acknowledged',
READY: 'ready',
COMPLETED: 'completed', 
} as const;

const orderSchema = new Schema<IOrder>(
{
  product: {
    type: Schema.Types.ObjectId,
    ref: 'product',
    required: [true, 'Product is required'], 
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'], 
    min: [1, 'Quantity must be at least 1'],
  },
  additionalMessage: {
    type: String,
    required: false, 
  },
  chemicals: [
    {
      chemical: {
        type: Schema.Types.ObjectId,
        ref: 'chemical',
        required: [true, 'Chemical is required'], 
      },
      quantity: {
        type: Number,
        required: [true, 'Chemical quantity is required'],
        min: [1, 'Chemical quantity must be at least 1'],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'], 
    min: [0, 'Total price must be a positive number'],
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  createdBy: {
    type: String,
    required: false, 
  },
  acknowledgedBy: {
    type: String,
  default: '' },

  readyBy: { 
  type: String, 
  default: '' },

  readyDate: { 
    type: String,
    default: '' },

  completedBy: { 
  type: String,
    default: '' },

  completedAt: { 
    type: String,
    default: '' },

},
{ timestamps: true }
);

orderSchema.index({ createdBy: 1, status: 1, product: 1 });

orderSchema.pre('save', function (next) {
if (this.chemicals.length === 0) {
  next(new Error('At least one chemical is required'));
} else {
  next();
}
});

const Order = model<IOrder>('order', orderSchema);
export default Order;