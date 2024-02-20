import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/axiosInstance';
import { useCustomToast } from '@/components/app/hooks/useCustomToast';
import { queryKeys } from '@/react-query/constants';
import { Appointment } from '@shared/types';

// for when server call is needed
async function removeAppointmentUser(appointment: Appointment): Promise<void> {
  const patchData = [{ op: 'remove', path: '/userId' }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useCancelAppointment(): (appointment: Appointment) => void {
  const toast = useCustomToast();

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    // mutate 함수에 예약을 전달하면 removeAppointmentUser 함수에
    // 전달되기 때문에 따로 인수를 전달하는 함수를 만들지 않았다
    // useReserveAppointment에서는 userId 추가 전달이 필요했기 때문에
    // 별도의 함수를 만들어서 전달했었다
    mutationFn: removeAppointmentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.appointments] });
      toast({ title: 'You have cancelled an appointment!', status: 'warning' });
    },
  });

  return mutate;
}
