import { useGetSingleChemicalQuery } from '../redux/features/management/chemicalApi';

export const useGetChemicalDetails = (chemicalIds: string[]) => {
  // Fetch chemical details for each ID
  const chemicalQueries = chemicalIds.map((id) => useGetSingleChemicalQuery(id, { skip: !id }));

  // Extract data from each query
  const chemicalDetails = chemicalQueries.map((query) => query.data?.data);

  return chemicalDetails;
};