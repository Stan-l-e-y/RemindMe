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
      validate(createUserSchema)(req);
      req.body = omit(req.body, 'passwordConfirmation');
      const user = await createUser(req.body as UserInput);
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
