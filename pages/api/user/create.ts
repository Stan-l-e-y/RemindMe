import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../services/user';
import { UserInput } from '../../../types/user.schema';
import { omit } from 'lodash';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        req.body = omit(req.body, 'passwordConfirmation');
        const user = await createUser(req.body as UserInput);
        res.status(201).json(user);
      } catch (error: any) {
        res.status(409).json({ error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
