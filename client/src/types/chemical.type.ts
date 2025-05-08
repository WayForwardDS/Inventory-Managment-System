export interface IChemical {
  _id: string; 
  name: string;
  quantity: number;
  type: string;
  createdAt: string; 
  updatedAt: string; 
  min_qty?: number; 
  price: number;
}
