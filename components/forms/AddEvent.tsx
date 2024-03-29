import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import fetcher from '@/lib/fetcher';
import { CreateEventInput, createEventSchema } from '@/types/client/event';

export default function AddEvent() {
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
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`col-start-4 col-end-10 row-start-2 row-end-3 z-10 `}
    >
      <input
        type="text"
        className="
           w-full
           py-2 px-4
           self-start
           text-base
           font-normal
           text-white
           border border-solid 
           border-blueGrey-600
           rounded-2xl
           transition
           ease-in-out
           focus:outline-blueGrey-50
           m-0 
           focus:outline-none 
           bg-inherit 
           flex-1
           "
        {...register('name')}
        placeholder="Enter name*"
      ></input>
      <input
        type="text"
        className="
           w-full
           py-2 px-4
           self-start
           text-base
           font-normal
           text-white
           border border-solid 
           border-blueGrey-600
           rounded-2xl
           transition
           ease-in-out
           focus:outline-blueGrey-50
           m-0 
           focus:outline-none 
           bg-inherit 
           flex-1
           "
        {...register('type')}
        placeholder="Enter type*"
      ></input>
      <input
        type="date"
        className="
           w-full
           py-2 px-4
           self-start
           text-base
           font-normal
           text-white
           border border-solid 
           border-blueGrey-600
           rounded-2xl
           transition
           ease-in-out
           focus:outline-blueGrey-50
           m-0 
           focus:outline-none 
           bg-inherit 
           flex-1
           "
        {...register('startDate')}
      ></input>
      <button
        className=" bg-gradient-to-r from-blueGrey-500 to-blueGrey-700 hover:from-blueGrey-600 hover:to-blueGrey-800  text-white font-bold py-2 px-4 w-full rounded-2xl tracking-widest "
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
