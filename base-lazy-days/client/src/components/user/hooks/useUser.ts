import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@shared/types';

import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../user-storage';

import { useLoginData } from '@/auth/AuthContext';
import { queryKeys } from '@/react-query/constants';
import { generateUserKey } from '@/react-query/key-factories';

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

interface UseUser {
  user: User | null;
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export function useUser(): UseUser {
  const queryClient = useQueryClient();
  const { userId, userToken } = useLoginData();

  // get details on the userId, userToken
  const { data: user } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity,
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // 캐시 데이터에 추가
    // setQueryData는 첫번째 인자로 쿼리 키를 받고,
    // 두번째 인자로 새로운 데이터를 넣어준다
    queryClient.setQueryData(
      generateUserKey(newUser.id, newUser.token),
      newUser
    );
  }

  // meant to be called from useAuth
  function clearUser() {
    // remove user profile data
    // 쿼리 키가 queryKeys.user인 캐시 데이터를 모두 제거
    queryClient.removeQueries({ queryKey: [queryKeys.user] });

    // remove user appointments data
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUser, clearUser };
}
