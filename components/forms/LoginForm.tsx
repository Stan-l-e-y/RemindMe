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
      await fetcher('/api/session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      router.push('/');
    } catch (error: any) {
      setServerError(error.message);
      setTimeout(() => {
        setServerError(null);
      }, 4000);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className=" ">
        <div>
          <div>
            <input
              type="email"
              className="form-control
                w-full
                          self-start
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-lg
                          transition
                          ease-in-out
                          m-0 focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('email')}
              placeholder="Enter email*"
            ></input>
            {errors.email && (
              <p className="text-red-500 mt-3">{errors.email?.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              className="form-control
                w-full
                          self-start
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-lg
                          transition
                          ease-in-out
                          m-0 focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('password')}
              placeholder="Enter password*"
            ></input>
            {errors.password && (
              <p className="text-red-500 mt-3">{errors.password?.message}</p>
            )}
          </div>
          <div>
            <button
              className=" bg-[#0070f3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              type="submit"
            >
              Log in
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
