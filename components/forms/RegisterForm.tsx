import { createUserSchema, CreateUserInput } from '../../types/client/user';
import { zodResolver } from '@hookform/resolvers/zod';
import fetcher from '../../lib/fetcher';
import { useForm } from 'react-hook-form';
import type { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

export default function RegisterForm({
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
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      const res = await fetcher(
        '/api/user/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
        true
      );

      router.push('/login'); //TODO: change this to toggle the Login view boolean
    } catch (error: any) {
      setServerError(error.message);
      setTimeout(() => {
        setServerError(null);
      }, 8000);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('email')}
              placeholder="Enter email*"
            ></input>
            {errors.email && (
              <p className="text-red-500 mt-3">{errors.email?.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
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
                           focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('firstName')}
              placeholder="Enter First Name*"
            ></input>
            {errors.firstName && (
              <p className="text-red-500 mt-3">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
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
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('lastName')}
              placeholder="Enter Last Name*"
            ></input>
            {errors.lastName && (
              <p className="text-red-500 mt-3">{errors.lastName.message}</p>
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
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('password')}
              placeholder="Enter password*"
            ></input>
            {errors.password && (
              <p className="text-red-500 mt-3">{errors.password?.message}</p>
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
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
              {...register('passwordConfirmation')}
              placeholder="Confirm Password*"
            ></input>
            {errors.passwordConfirmation && (
              <p className="text-red-500 mt-3">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center mt-10">
            <button
              className=" bg-[#0070f3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              type="submit"
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
