import { Document, Types } from 'mongoose';

interface IChemical {
  chemical: Types.ObjectId;
  quantity: number;
  _id?: Types.ObjectId; 
}

export interface IOrder extends Document {
  product: Types.ObjectId;
  quantity: number;
  additionalMessage?: string;
  chemicals: IChemical[];
  totalPrice: number;
  status: 'pending' | 'acknowledged' | 'ready' | 'completed'; 
  createdBy: string;
  acknowledgedBy?: string; 
  readyBy?: string; 
  readyDate?: string; 
  completedBy?: string; 
  completedAt?: string; 
  createdAt: Date; 
  updatedAt: Date; 
}