import { useState, useEffect } from 'react';
import { Aisle } from '../types/warehouse.type';
import { useGetAislesQuery } from '../redux/features/management/warehouseApt';

export const useAisle = () => {
  const { data: aisles = [], isLoading } = useGetAislesQuery();
  const [selectedAisle, setSelectedAisle] = useState<Aisle | null>(null);

  useEffect(() => {
    if (aisles.length > 0 && !selectedAisle) {
      setSelectedAisle(aisles[0]);
    }
  }, [aisles, selectedAisle]);

  const getAisleRacks = (aisleId: string) => {
    const aisle = aisles.find((a: { id: string; }) => a.id === aisleId);
    return aisle?.racks || [];
  };

  const isAisleFull = (aisleId: string) => {
    const racks = getAisleRacks(aisleId);
    return racks.length > 0 && racks.every((rack: { used: number; capacity: number; }) => (rack.used / rack.capacity) >= 1);
  };

  return {
    aisles,
    isLoading,
    selectedAisle,
    setSelectedAisle,
    getAisleRacks,
    isAisleFull
  };
};