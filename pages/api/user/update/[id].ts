import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';
import { UpdateUserInput } from '../../../../types/user.schema';
import { updateUser } from '../../../../services/user';

//TODO: create the prisma middleware for pre save and console.log anything to see if it works
//TODO: create the handler to update the user in the database
//i might not needs this prisma middleware, i can create an updateUserInput schema
//and use that to validate the request body, if the password is not provided, then
//i can just update the user without updating the password
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'PUT':
      try {
        const id = Number(req.query.id);
        const user = updateUser(id, req.body as UpdateUserInput);
        res.status(200).json(user);
      } catch (error: any) {
        res.status(409).json({ error: error.message });
      }

      break;
    default:
      res.setHeader('Allow', ['PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
