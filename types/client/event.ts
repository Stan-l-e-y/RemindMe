import { object, string, TypeOf, z, date } from 'zod';
import { EventType } from '@prisma/client';

export const createEventSchema = object({
  name: string({
    required_error: 'Name is required',
  }).min(2, 'Name must be at least 2 characters'),
  description: z.string().min(2, 'Must be at least 2 characters').optional(),
  type: z.nativeEnum(EventType),
  startDate: z.coerce
    .date({
      required_error: 'Please select a date and time',
      invalid_type_error: "That's not a date!",
    })
    .min(new Date('now'), { message: "Can't set a date in the past!" }),
  endDate: z.coerce
    .date({
      required_error: 'Please select a date and time',
      invalid_type_error: "That's not a date!",
    })
    .min(new Date('now'), { message: "Can't set a date in the past!" })
    .optional(),
});

export type CreateEventInput = TypeOf<typeof createEventSchema>;
