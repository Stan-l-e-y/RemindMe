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

  //TODO: show event add form onClick of the plus icon
  //TODO: create layout of home page (main content)

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
    <div className="h-screen w-full ">
      home
      <div>test</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="form-control
                w-full
                py-2 px-4
                          self-start
                          text-base
                          font-normal
                          text-white
                          border border-solid border-blueGrey-600
                          rounded-2xl
                          transition
                          ease-in-out
                          focus:outline-blueGrey-50
                          m-0 focus:outline-none    bg-inherit flex-1"
          {...register('name')}
          placeholder="Enter name*"
        ></input>
        <input
          type="text"
          className="form-control
                w-full
                py-2 px-4
                          self-start
                          text-base
                          font-normal
                          text-white
                          border border-solid border-blueGrey-600
                          rounded-2xl
                          transition
                          ease-in-out
                          focus:outline-blueGrey-50
                          m-0 focus:outline-none    bg-inherit flex-1"
          {...register('type')}
          placeholder="Enter type*"
        ></input>
        <input
          type="date"
          className="form-control
                w-full
                py-2 px-4
                          self-start
                          text-base
                          font-normal
                          text-white
                          border border-solid border-blueGrey-600
                          rounded-2xl
                          transition
                          ease-in-out
                          focus:outline-blueGrey-50
                          m-0 focus:outline-none    bg-inherit flex-1"
          {...register('startDate')}
        ></input>
        <button
          className=" bg-gradient-to-r from-blueGrey-500 to-blueGrey-700 hover:from-blueGrey-600 hover:to-blueGrey-800  text-white font-bold py-2 px-4 w-full rounded-2xl tracking-widest "
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default Home;
