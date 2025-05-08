import { baseApi } from '../baseApi';

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (query) => ({
        url: '/orders',
        method: 'GET',
        params: query,
      }),
      providesTags: ['order'],
    }),

    countOrders: builder.query({
      query: (query) => ({
        url: '/orders/total',
        method: 'GET',
        params: query,
      }),
      providesTags: ['order'],
    }),

    getSingleOrder: builder.query({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: ['order'],
    }),

    createNewOrder: builder.mutation({
      query: (payload) => ({
        url: '/orders',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['order'],
    }),

    acknowledgeOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/acknowledge`,
        method: 'PATCH',
      }),
      invalidatesTags: ['order'],
    }),
    completeOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/complete`,
        method: 'PATCH',
      }),
      invalidatesTags: ['order'],
    }),

    markOrderAsReady: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/ready`,
        method: 'PATCH',
      }),
      invalidatesTags: ['order'],
    }),

    updateOrder: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/orders/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['order'],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['order'],
    }),

    bulkDeleteOrders: builder.mutation({
      query: (payload) => ({
        url: '/orders/bulk-delete',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['order'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useCountOrdersQuery,
  useGetSingleOrderQuery,
  useCreateNewOrderMutation,
  useAcknowledgeOrderMutation,
  useCompleteOrderMutation,
  useMarkOrderAsReadyMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useBulkDeleteOrdersMutation,
} = orderApi;