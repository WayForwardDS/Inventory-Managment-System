interface IChemical {
  _id: string;
  chemicalId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface IProduct {
  _id: string;
  name: string;
  price: number;
  chemicals: IChemical; 
  createdAt: string;
  updatedAt: string;
  user: string;
  stock:number;
  size:number;
}