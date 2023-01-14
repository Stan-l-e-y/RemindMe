import { CreateEventInput, createEventSchema } from '@/types/client/event';
import type { GetServerSideProps, NextPage } from 'next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import fetcher from '@/lib/fetcher';

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
  });

  const onSubmit = async (data: CreateEventInput) => {
    try {
      await fetcher(
        '/api/user/event/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        true
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  //
  return (
    <div>
      home
      <div>test</div>
    </div>
  );
};

export default Home;
