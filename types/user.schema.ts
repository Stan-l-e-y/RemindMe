import { object, string, TypeOf, z } from 'zod';
//This schema and type corelate to registering a user

//will be used in the validation middleware
export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }).min(2, 'First name must be at least 2 characters'),
    lastName: string({
      required_error: 'Last name is required',
    }).min(2, 'Last name must be at least 2 characters'),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Email must be a valid email'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  }),
});

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const updateUserSchema = object({
  body: object({
    firstName: string().min(2, 'First name must be at least 2 characters'),
    lastName: string().min(2, 'Last name must be at least 2 characters'),
    password: string().min(6, 'Password must be at least 6 characters'),
    passwordConfirmation: string(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords must match',
    path: ['passwordConfirmation'],
  }),
});

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  password?: string;
};
