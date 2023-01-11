import { createUserSchema, CreateUserInput } from '../../types/client/user';
import { zodResolver } from '@hookform/resolvers/zod';
import fetcher from '../../lib/fetcher';
import { useForm } from 'react-hook-form';
import type { NextRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

export default function RegisterForm({
  setServerError,
  setIsLoginView,
}: {
  setServerError: Dispatch<SetStateAction<string | null>>;
  setIsLoginView: Dispatch<SetStateAction<boolean>>;
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
      await fetcher(
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

      setIsLoginView(true);
    } catch (error: any) {
      setServerError(error.message);
      setTimeout(() => {
        setServerError(null);
      }, 8000);
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
                          border border-solid border-gray-700
                          rounded-2xl
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

        <div className="mt-5">
          <input
            type="text"
            className="form-control
                w-full
                          self-start
                          py-2 px-4
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-2xl
                          transition
                          ease-in-out
                           focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
            {...register('firstName')}
            placeholder="Enter first name*"
          ></input>
          {errors.firstName && (
            <p className="text-red-500 mt-3">{errors.firstName.message}</p>
          )}
        </div>

        <div className="mt-5">
          <input
            type="text"
            className="form-control
                w-full
                py-2 px-4
                          self-start                          
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-2xl
                          transition
                          ease-in-out
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
            {...register('lastName')}
            placeholder="Enter last name*"
          ></input>
          {errors.lastName && (
            <p className="text-red-500 mt-3">{errors.lastName.message}</p>
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
                          border border-solid border-gray-700
                          rounded-2xl
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
                          border border-solid border-gray-700
                          rounded-2xl
                          transition
                          ease-in-out
                          focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
            {...register('passwordConfirmation')}
            placeholder="Confirm password*"
          ></input>
          {errors.passwordConfirmation && (
            <p className="text-red-500 mt-3">
              {errors.passwordConfirmation.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <button
            className=" bg-gradient-to-r from-blueGrey-500 to-blueGrey-700 hover:from-blueGrey-600 hover:to-blueGrey-800  text-white font-bold py-2 px-4 w-full rounded-2xl tracking-widest "
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </>
  );
}
