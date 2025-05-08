import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

const chemicalSubSchema = new Schema(
  {
    chemicalId: { type: Schema.Types.ObjectId, required: true, ref: 'chemical' },
    quantity: { type: Number, required: true, min: 1 }, 
  },
  { _id: false } 
);

const productSchema = new Schema<IProduct>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
    chemicals: [chemicalSubSchema],
    name: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Product = model<IProduct>('product', productSchema);
export default Product;