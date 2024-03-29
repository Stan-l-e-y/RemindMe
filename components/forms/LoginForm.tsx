import {
  createSessionSchema,
  CreateSessionInput,
} from '../../types/client/session';
import { zodResolver } from '@hookform/resolvers/zod';
import fetcher from '../../lib/fetcher';
import { useForm } from 'react-hook-form';
import type { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

export default function LoginForm({
  router,
  setServerError,
}: {
  router: NextRouter;
  setServerError: Dispatch<SetStateAction<string | null>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  });

  const onSubmit = async (data: CreateSessionInput) => {
    try {
      await fetcher(
        '/api/session/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        true
      );

      router.push('/home');
    } catch (error: any) {
      setServerError(error.message);
      setTimeout(() => {
        setServerError(null);
      }, 4000);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-evenly h-full"
      >
        <div>
          <input
            type="email"
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
            {...register('email')}
            placeholder="Enter email*"
          ></input>
          {errors.email && (
            <p className="text-red-500 mt-3">{errors.email?.message}</p>
          )}
        </div>
        <div className="mt-5">
          <input
            type="password"
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
                          m-0 focus:outline-none  bg-inherit flex-1"
            {...register('password')}
            placeholder="Enter password*"
          ></input>
          {errors.password && (
            <p className="text-red-500 mt-3">{errors.password?.message}</p>
          )}
        </div>
        <div className="mt-5">
          <button
            className=" bg-gradient-to-r from-blueGrey-500 to-blueGrey-700 hover:from-blueGrey-600 hover:to-blueGrey-800  text-white font-bold py-2 px-4 w-full rounded-2xl tracking-widest "
            type="submit"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
}
