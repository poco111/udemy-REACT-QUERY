import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';

import type { Staff } from '@shared/types';

import { filterByTreatment } from '../utils';

import { axiosInstance } from '@/axiosInstance';
import { queryKeys } from '@/react-query/constants';

// for when we need a query function for useQuery
async function getStaff(): Promise<Staff[]> {
  const { data } = await axiosInstance.get('/staff');
  return data;
}

interface UseStaff {
  staff: Staff[];
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

export function useStaff(): UseStaff {
  // for filtering staff by treatment
  const [filter, setFilter] = useState('all');
  const fallback: Staff[] = [];

  const selectFn = useCallback(
    (unFilteredStaff: Staff[]) => {
      return filter === 'all'
        ? unFilteredStaff
        : filterByTreatment(unFilteredStaff, filter);
    },
    [filter]
  );

  const { data: staff = fallback } = useQuery({
    queryKey: [queryKeys.staff],
    queryFn: getStaff,
    select: selectFn,
  });

  return { staff, filter, setFilter };
}
