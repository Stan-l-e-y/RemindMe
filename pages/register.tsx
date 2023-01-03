import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { zodResolver } from '@hookform/resolvers/zod';
import fetcher from '../lib/fetcher';
import { useState } from 'react';
import { createUserSchema, CreateUserInput } from '../types/client/user';

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await fetcher('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      router.push('/login');
    } catch (error: any) {
      setServerError(error.message);
      setTimeout(() => {
        setServerError(null);
      }, 4000);
    }
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Full Stack App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} `}>
        <h1 className={styles.title}>Register</h1>
        {serverError && (
          <p className="error mt-5 mb-5 text-red-500">{serverError}</p>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-[40rem] w-[20rem] flex-col "
        >
          <div className="border border-solid border-gray-700 mt-10 p-8">
            <div className=" flex flex-col">
              <label htmlFor="email" className="font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                className="form-control
                w-full
                          self-start
                          px-3
                          py-1.5
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

            <div className="mt-10 flex flex-col ">
              <label htmlFor="firstName" className="font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                className="form-control
                w-full
                          self-start
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-lg
                          transition
                          ease-in-out
                          m-0 focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
                {...register('firstName')}
                placeholder="Enter First Name*"
              ></input>
              {errors.firstName && (
                <p className="text-red-500 mt-3">{errors.firstName.message}</p>
              )}
            </div>

            <div className="mt-10 flex flex-col ">
              <label htmlFor="lastName" className="font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="form-control
                w-full
                          self-start
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-lg
                          transition
                          ease-in-out
                          m-0 focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
                {...register('lastName')}
                placeholder="Enter Last Name*"
              ></input>
              {errors.lastName && (
                <p className="text-red-500 mt-3">{errors.lastName.message}</p>
              )}
            </div>

            <div className="mt-10 flex flex-col ">
              <label htmlFor="password" className="font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                className="form-control
                w-full
                          self-start
                          px-3
                          py-1.5
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

            <div className="mt-10 flex flex-col ">
              <label
                htmlFor="passwordConfirmation"
                className="font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control
                w-full
                          self-start
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-white
                          border border-solid border-gray-700
                          rounded-lg
                          transition
                          ease-in-out
                          m-0 focus:outline-none  focus-visible:ring-2  focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 bg-inherit flex-1"
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
              <div
                className="hover:cursor-pointer text-[#0070f3] hover:text-blue-700 underline"
                onClick={() => router.push('/login')}
              >
                Already registered?
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
