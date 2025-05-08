import { Schema, model } from 'mongoose';
import { IChemicals } from './chemical.interface';

const chemicalSchema = new Schema<IChemicals>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
    min_qty: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: String, default: '-' },
  }
);

const Chemical = model<IChemicals>('chemical', chemicalSchema);
export default Chemical;