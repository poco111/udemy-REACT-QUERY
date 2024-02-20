import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useMutationState } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MUTATION_KEY, usePatchUser } from './hooks/usePatchUser';
import { useUser } from './hooks/useUser';
import { UserAppointments } from './UserAppointments';
import { useLoginData } from '@/auth/AuthContext';
import { User } from '@shared/types';

export function UserProfile() {
  const { user } = useUser();
  const { userId } = useLoginData();
  const patchUser = usePatchUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
    }
  }, [userId, navigate]);

  const formElements = ['name', 'address', 'phone'];
  interface FormValues {
    name: string;
    address: string;
    phone: string;
  }

  const pendingData = useMutationState({
    filters: { mutationKey: [MUTATION_KEY], status: 'pending' },
    // select의 콜백함수의 매개변수에는 mutation의 현재 상태 객체를 인자로 받는다
    // select의 콜백함수에서 반환된 데이터가 곧 pendingData에 담기게 된다
    // 현재 pending 상태의 mutation들이 실행될 때 사용된 변수들을 가져온다
    select: (mutation) => mutation.state.variables as User,
  });

  // pendingData는 현재 pending 상태인 mutation들이 실행될 때 사용된 변수들이 담긴 배열
  // 실행중인 mutation이 한 개이기 때문에 우리는 0번째 인덱스를 사용한다
  const pendingUser = pendingData ? pendingData[0] : null;

  return (
    <Flex minH="84vh" textAlign="center" justify="center">
      <Stack spacing={8} mx="auto" w="xl" py={12} px={6}>
        <UserAppointments />
        <Stack textAlign="center">
          <Heading>
            Information for {pendingUser ? pendingUser.name : user?.name}
          </Heading>
        </Stack>
        <Box rounded="lg" bg="white" boxShadow="lg" p={8}>
          <Formik
            enableReinitialize
            initialValues={{
              name: user?.name ?? '',
              address: user?.address ?? '',
              phone: user?.phone ?? '',
            }}
            onSubmit={(values: FormValues) => {
              patchUser({ ...user, ...values });
            }}
          >
            <Form>
              {formElements.map((element) => (
                <FormControl key={element} id={element}>
                  <FormLabel>{element}</FormLabel>
                  <Field name={element} as={Input} />
                </FormControl>
              ))}
              <Button mt={6} type="submit">
                Update
              </Button>
            </Form>
          </Formik>
        </Box>
      </Stack>
    </Flex>
  );
}
