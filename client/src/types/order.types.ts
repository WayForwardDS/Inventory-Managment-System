
export type IOrder = {
  _id: string; 
  product: string; 
  quantity: number; 
  additionalMessage?: string; 
  chemicals: IChemicals[]; 
  totalPrice: number; 
  status: 'pending' | 'acknowledged' | 'ready'| 'completed'; 
  createdBy: string; 
  acknowledgedBy?: string; 
  completedBy?: string; 
  completedAt?: Date; 
  readyBy?: string; 
  readyDate?: Date; 
  createdAt?: Date; 
  updatedAt?: Date; 
};

export interface IChemicals {
  _id: string;
  chemical: string; 
  quantity: number; 
}