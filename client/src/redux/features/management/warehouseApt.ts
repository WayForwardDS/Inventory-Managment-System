import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Rack, ProductInRack, StockOperation, Aisle } from '../../../types/warehouse.type';

// Enhanced mock data with more realistic structure
const mockAisles: Aisle[] = [
  {
    id: 'aisle-1',
    name: 'Aisle A',
    size: 'Large',
    racks: [
      {
        id: 'rack-1',
        name: 'Rack A1',
        capacity: 100,
        used: 30,
        products: [
          { 
            id: 'prod-1', 
            barcode: '12345678', 
            name: 'Product X', 
            quantity: 10, 
            rackId: 'rack-1', 
            lastUpdated: new Date().toISOString() 
          }
        ],
        aisleId: 'aisle-1',
        barcode: 'RACK001',
        _id: 'rack-1-db-id'
      }
    ],
    _id: 'aisle-1-db-id'
  },
  {
    id: 'aisle-2',
    name: 'Aisle B',
    size: 'Medium',
    racks: [
      {
        id: 'rack-2',
        name: 'Rack B1',
        capacity: 80,
        used: 65,
        products: [
          { 
            id: 'prod-2', 
            barcode: '87654321', 
            name: 'Product Y', 
            quantity: 15, 
            rackId: 'rack-2', 
            lastUpdated: new Date().toISOString() 
          }
        ],
        aisleId: 'aisle-2',
        barcode: 'RACK002',
        _id: 'rack-2-db-id'
      }
    ],
    _id: 'aisle-2-db-id'
  }
];

// Helper function to simulate API delay
const simulateNetworkDelay = async (ms: number = 300) => {
  await new Promise(resolve => setTimeout(resolve, ms));
};

export const warehouseApi = createApi({
  reducerPath: 'warehouseApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/warehouse',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Racks', 'Aisles', 'Stock'],
  endpoints: (builder) => ({
    // Rack endpoints with mock fallback
    getRacks: builder.query<Rack[], void>({
      query: () => '/racks',
      providesTags: ['Racks'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Mock fallback
          await simulateNetworkDelay();
          const mockResponse = mockAisles.flatMap(aisle => aisle.racks);
          dispatch(
            warehouseApi.util.upsertQueryData('getRacks', undefined, mockResponse)
          );
        }
      },
    }),
    
    // Aisle endpoints with mock fallback
    getAisles: builder.query<Aisle[], void>({
      query: () => '/aisles',
      providesTags: ['Aisles'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Mock fallback
          await simulateNetworkDelay();
          dispatch(
            warehouseApi.util.upsertQueryData('getAisles', undefined, mockAisles)
          );
        }
      },
    }),
    
    addAisle: builder.mutation<Aisle, { name: string; size: string }>({
      query: (newAisle) => ({
        url: '/aisles',
        method: 'POST',
        body: newAisle,
      }),
      invalidatesTags: ['Aisles'],
      async onQueryStarted(newAisle, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Mock fallback
          await simulateNetworkDelay();
          const mockAisle: Aisle = {
            ...newAisle,
            id: `aisle-${Date.now()}`,
            racks: [],
            _id: `aisle-${Date.now()}-db-id`
          };
          dispatch(
            warehouseApi.util.updateQueryData('getAisles', undefined, (draft) => {
              draft.push(mockAisle);
            })
          );
        }
      },
    }),
    
    // Stock endpoints
    getStockByBarcode: builder.query<ProductInRack, string>({
      query: (barcode) => `/stock/${barcode}`,
      providesTags: (_result, _error, barcode) => [{ type: 'Stock', id: barcode }],
    }),
    
    updateStock: builder.mutation<void, StockOperation>({
      query: (operation) => ({
        url: '/stock',
        method: 'POST',
        body: operation,
      }),
      invalidatesTags: (_result, _error, operation) => [
        'Racks',
        { type: 'Stock', id: operation.productBarcode }
      ],
    }),

    // Enhanced rack mutations with mock fallback
    addRack: builder.mutation<Rack, Omit<Rack, 'id' | 'products' | '_id'> & { aisleId: string }>({
      query: (newRack) => ({
        url: '/racks',
        method: 'POST',
        body: newRack,
      }),
      invalidatesTags: ['Racks'],
      async onQueryStarted(newRack, { dispatch, queryFulfilled }) {
        const { aisleId, ...rackData } = newRack;
        try {
          await queryFulfilled;
        } catch (error) {
          // Mock fallback
          await simulateNetworkDelay();
          const mockRack: Rack = {
            ...rackData,
            id: `rack-${Date.now()}`,
            aisleId,
            products: [],
            _id: `rack-${Date.now()}-db-id`
          };
          
          // Update racks query
          dispatch(
            warehouseApi.util.updateQueryData('getRacks', undefined, (draft) => {
              draft.push(mockRack);
            })
          );
          
          // Update aisles query to include the new rack
          dispatch(
            warehouseApi.util.updateQueryData('getAisles', undefined, (draft) => {
              const aisle = draft.find(a => a.id === aisleId);
              if (aisle) {
                aisle.racks.push(mockRack);
              }
            })
          );
        }
      },
    }),
    
    deleteRack: builder.mutation<void, string>({
      query: (rackId) => ({
        url: `/racks/${rackId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Racks'],
      async onQueryStarted(rackId, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Mock fallback - remove from both queries
          await simulateNetworkDelay();
          
          // Remove from racks query
          dispatch(
            warehouseApi.util.updateQueryData('getRacks', undefined, (draft) => {
              return draft.filter(rack => rack.id !== rackId);
            })
          );
          
          // Remove from aisles query
          dispatch(
            warehouseApi.util.updateQueryData('getAisles', undefined, (draft) => {
              draft.forEach(aisle => {
                aisle.racks = aisle.racks.filter(rack => rack.id !== rackId);
              });
            })
          );
        }
      },
    }),
  }),
});

// Type-safe exports
export const {
  useGetRacksQuery,
  useLazyGetRacksQuery,
  useGetAislesQuery,
  useLazyGetAislesQuery,
  useAddAisleMutation,
  useGetStockByBarcodeQuery,
  useLazyGetStockByBarcodeQuery,
  useUpdateStockMutation,
  useAddRackMutation,
  useDeleteRackMutation,
} = warehouseApi;

// Export endpoints for use in sagas or other advanced scenarios
export const warehouseApiEndpoints = warehouseApi.endpoints;