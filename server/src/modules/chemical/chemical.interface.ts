import { Types } from 'mongoose';

export interface IChemicals {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  type: string;
  min_qty: number;
  createdAt: Date; 
  updatedAt: string;
}