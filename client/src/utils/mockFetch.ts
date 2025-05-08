// utils/mockFetch.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const mockFetch = (baseUrl: string) => {
  const mockData = {
    // You can extract mockRacks and mockProducts here if needed
  };

  return async (input: RequestInfo, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.url;

    const createMockResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    // Write your mock endpoints logic here (similar to your `warehouseApi.ts` file)

    // Fallback
    return fetch(input, init);
  };
};
