import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/axiosInstance';
import { useCustomToast } from '@/components/app/hooks/useCustomToast';
import { useUser } from '@/components/user/hooks/useUser';
import { queryKeys } from '@/react-query/constants';
import { Appointment } from '@shared/types';
import { useLoginData } from '@/auth/AuthContext';

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? 'replace' : 'add';
  const patchData = [{ op: patchOp, path: '/userId', value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

// TODO: update type for React Query mutate function
type AppointmentMutationFunction = (appointment: Appointment) => void;

export function useReserveAppointment(): AppointmentMutationFunction {
  const { userId } = useLoginData();
  const toast = useCustomToast();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      // mutation 성공시에 쿼리 무효화
      // 해당 키로 시작하는 부분 일치하는 모든 쿼리를 무효화 후 리페치 트리거
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({ title: 'You have reserved an appointment!', status: 'success' });
    },
  });

  return mutate;
}
