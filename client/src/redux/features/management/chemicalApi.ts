import { baseApi } from "../baseApi";

const chemicalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllChemicals: builder.query({
      query: (query) => ({
        url: '/chemicals',
        method: 'GET',
        params: query
      }),
      providesTags: ['chemical']
    }),
    countChemicals: builder.query({
      query: (query) => ({
        url: '/chemicals/total',
        method: 'GET',
        params: query
      }),
      providesTags: ['chemical']
    }),
    getSingleChemical: builder.query({
      query: (id) => ({
        url: `/chemicals/${id}`,
        method: 'GET'
      }),
      providesTags: ['chemical']
    }),
    createNewChemical: builder.mutation({
      query: (payload) => ({
        url: '/chemicals', 
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['chemical'],  
    }),
    
    deleteChemical: builder.mutation({
      query: (id) => ({
        url: `/chemicals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['chemical']
    }),
    updateChemical: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/chemicals/${id}`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: ['chemical']
    }),
    bulkDelete: builder.mutation({
      query: (payload) => ({
        url: '/chemicals/bulk-delete',
        method: 'POST',
        body: payload
      }),
      invalidatesTags: ['chemical']
    }),
  })
})

export const {
  useGetAllChemicalsQuery,
  useCountChemicalsQuery,
  useCreateNewChemicalMutation,
  useDeleteChemicalMutation,
  useGetSingleChemicalQuery,
  useUpdateChemicalMutation,
  useBulkDeleteMutation } = chemicalApi