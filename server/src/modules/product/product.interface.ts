import { Types } from 'mongoose';

export interface IProduct {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  chemicals: Types.ObjectId | Types.ObjectId[];
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
