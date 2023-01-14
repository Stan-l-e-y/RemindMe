import { object, string, TypeOf, z, date } from 'zod';

export const createEventSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }).min(2, 'Name must be at least 2 characters'),
    description: z.string().min(2, 'Must be at least 2 characters').optional(),
    startDate: date({
      required_error: 'Please select a date and time',
      invalid_type_error: "That's not a date!",
    }).min(new Date('now'), { message: "Can't set a date in the past!" }),
    endDate: date({
      required_error: 'Please select a date and time',
      invalid_type_error: "That's not a date!",
    })
      .min(new Date('now'), { message: "Can't set a date in the past!" })
      .optional(),
  }),
});

export type EventInput = TypeOf<typeof createEventSchema>;

// export const updateUserSchema = object({
//   body: object({
//     firstName: z
//       .string()
//       .min(2, 'First name must be at least 2 characters')
//       .optional(),
//     lastName: z
//       .string()
//       .min(2, 'Last name must be at least 2 characters')
//       .optional(),
//     password: z
//       .string()
//       .min(6, 'Password must be at least 2 characters')
//       .optional(),
//     passwordConfirmation: z
//       .string()
//       .min(6, 'Password Confimation must be at least 2 characters')
//       .optional(),
//   }).refine((data) => data?.password === data?.passwordConfirmation, {
//     message: 'Passwords must match',
//     path: ['passwordConfirmation'],
//   }),
// });

// export type UpdateUserInput = {
//   firstName?: string;
//   lastName?: string;
//   password?: string;
// };
