import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../services/user';
import { CreateUserInput } from '../../../types/user.schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'POST':
      try {
        const user = await createUser(req.body as CreateUserInput['body']);
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
