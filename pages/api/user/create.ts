import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../services/user';
import { UserInput } from '../../../types/user.schema';
import { omit } from 'lodash';
import validate from '../../../lib/validateResource';
import { createUserSchema } from '../../../types/user.schema';
import { ZodError } from 'zod';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === 'POST') {
    try {
      let createUserBody = validate(createUserSchema)(req);

      if (createUserBody.body.passwordConfirmation) {
        createUserBody = omit(createUserBody, 'body.passwordConfirmation');
      }

      const user = await createUser(createUserBody.body as UserInput);
      res.status(201).json(user);
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(409).json({ error: error.message });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
