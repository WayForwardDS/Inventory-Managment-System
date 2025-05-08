import { Key } from "react";

export interface Aisle {
  _id: any;
  id: string;
  name: string;
  size: string;
  racks: Rack[];
}

export interface Rack {
  _id: Key | null | undefined;
  id: string;
  name: string;
  barcode: string;
  capacity: number;
  used: number;
  products: ProductInRack[];
  aisleId: string;
}

export interface ProductInRack {
  id: string;
  barcode: string;
  name: string;
  quantity: number;
  rackId: string;
  lastUpdated: string;
}

export interface StockOperation {
  type: 'IN' | 'OUT' | 'DELETE' | 'MOVE_AISLE';
  productBarcode: string;
  quantity: number;
  rackId: string;
  targetAisleId?: string; // For aisle transfers
  timestamp: string;
}

// export interface Aisle {
//   id: string;
//   name: string;
//   date: Date;
//   racks: Rack[];
//   colorStatus: 'normal' | 'red';
// }

// export interface Rack {
//   id: string;
//   name: string;
//   barcode: string;
//   capacity: number;
//   fullness: number;
//   used: number;
//   products: ProductInRack[];
//   aisleId: string; // New field to link rack to aisle
// }

// export interface ProductInRack {
//   id: string;
//   barcode: string;
//   name: string;
//   quantity: number;
//   rackId: string;
//   lastUpdated: string;
// }

// export interface StockOperation {
//   type: 'IN' | 'OUT' | 'DELETE' | 'MOVE_AISLE';
//   productBarcode: string;
//   quantity: number;
//   rackId: string;
//   targetAisleId?: string; // For aisle transfers
//   timestamp: string;
// }