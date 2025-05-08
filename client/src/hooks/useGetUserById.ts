import { useState, useEffect } from 'react';
import { useGetSelfProfileQuery } from '../redux/features/authApi';

type IUser = {
  name: string;
  role: string;
};

export function useGetUserById(userId: string) {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { data, error: queryError } = useGetSelfProfileQuery(userId);

  useEffect(() => {
    if (data) {
      setUser(data.data); 
      setError(null);
    } else if (queryError) {
      console.error('Error fetching user:', queryError);
      setError('Failed to fetch user');
      setUser(undefined); // Set user to undefined in case of error
    }
    setIsLoading(false);
  }, [data, queryError]);

  return { user, isLoading, error };
}