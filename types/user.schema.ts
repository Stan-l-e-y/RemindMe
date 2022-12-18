import { object, string, TypeOf } from 'zod';
//This schema and type corelate to registering a user

//will be used in the validation middleware
export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: 'First name is required',
    }),
    lastName: string({
      required_error: 'Last name is required',
    }),
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

//will be used in the controller and passed to the service which is why
//we do not need the passwordConfirmation field
export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;

export interface UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
